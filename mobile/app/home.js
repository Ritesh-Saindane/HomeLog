import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useAssets } from '../src/context/AssetContext';
import { api } from '../src/services/api';
import { syncUserNotifications } from '../src/services/notifications';
import { TodoPanel } from '../src/components/TodoPanel';

const rooms = [
  { name: 'Living room', icon: '▱', color: '#e7f2fc' },
  { name: 'Kitchen', icon: '⌂', color: '#e7f5f0' },
  { name: 'Bedroom', icon: '☾', color: '#f0ecfb' },
  { name: 'Bathroom', icon: '◌', color: '#e9f5f6' },
  { name: 'Study room', icon: '▤', color: '#fbf1e4' },
  { name: 'Other', icon: '＋', color: '#f1f3f3' },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { assets, isLoading } = useAssets();
  const [schedules, setSchedules] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    if (isLoading || !assets.length) return;
    syncUserNotifications(assets, api).catch(() => {});
    let active = true;
    Promise.all(assets.map(async (asset) => {
      const [scheduleResult, serviceResult] = await Promise.all([
        api.get(`/assets/${asset.id}/maintenance`).catch(() => ({ data: [] })),
        api.get(`/assets/${asset.id}/services`).catch(() => ({ data: [] })),
      ]);
      return { asset, schedules: scheduleResult.data, services: serviceResult.data };
    })).then((results) => {
      if (!active) return;
      setSchedules(results.flatMap(({ asset, schedules: items }) => items.map((item) => ({ ...item, assetName: asset.name }))));
      setServices(results.flatMap(({ asset, services: items }) => items.map((item) => ({ ...item, assetName: asset.name }))));
    });
    return () => { active = false; };
  }, [assets, isLoading]);
  const monthSpend = useMemo(() => {
    const now = new Date();
    return services.filter((item) => { const date = new Date(item.serviceDate); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth(); }).reduce((sum, item) => sum + Number(item.cost || 0), 0);
  }, [services]);
  const activeSchedules = schedules.filter((item) => item.isActive);
  const roomsWithAssets = rooms.map((room) => ({ ...room, count: assets.filter((asset) => (asset.location || 'Other') === room.name).length }));

  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><View><Text style={styles.kicker}>HOMELOG</Text><Text style={styles.title}>Good day{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text><Text style={styles.subtitle}>A little care keeps home running.</Text></View><Pressable onPress={logout} style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text></Pressable></View>
    <View style={styles.summary}><View style={styles.summaryItem}><Text style={styles.summaryValue}>{assets.length}</Text><Text style={styles.summaryLabel}>Things at home</Text></View><View style={styles.divider}/><View style={styles.summaryItem}><Text style={styles.summaryValue}>{activeSchedules.length}</Text><Text style={styles.summaryLabel}>Upcoming care</Text></View><View style={styles.divider}/><View style={styles.summaryItem}><Text style={styles.summaryValue}>₹{monthSpend.toLocaleString('en-IN')}</Text><Text style={styles.summaryLabel}>Service this month</Text></View></View>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Rooms</Text><Pressable onPress={() => router.push('/assets')}><Text style={styles.seeAll}>All assets ›</Text></Pressable></View>
    <View style={styles.roomGrid}>{roomsWithAssets.map((room) => <Pressable key={room.name} onPress={() => router.push({ pathname: '/assets', params: { room: room.name } })} style={[styles.roomCard, { backgroundColor: room.color }]}><View style={styles.roomTop}><Text style={styles.roomIcon}>{room.icon}</Text><Text style={styles.roomCount}>{room.count}</Text></View><Text style={styles.roomName}>{room.name}</Text><Text style={styles.roomCaption}>{room.count === 1 ? '1 asset' : `${room.count} assets`}</Text></Pressable>)}</View>
    <TodoPanel schedules={activeSchedules} assets={assets} />
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Coming up</Text><Pressable onPress={() => router.push('/timeline')}><Text style={styles.seeAll}>Timeline ›</Text></Pressable></View>
    {activeSchedules.slice(0, 2).map((item) => <View key={item.id} style={styles.upcoming}><View style={styles.upcomingIcon}><Text style={styles.upcomingGlyph}>◷</Text></View><View style={styles.upcomingText}><Text style={styles.upcomingTitle}>{item.title}</Text><Text style={styles.roomCaption}>{item.assetName} · {String(item.nextDueDate).slice(0, 10)}</Text></View></View>)}
    <View style={styles.actions}><Pressable style={styles.actionPrimary} onPress={() => router.push('/assets/new')}><Text style={styles.actionPrimaryText}>＋ Add an asset</Text></Pressable><Pressable style={styles.actionSecondary} onPress={() => router.push('/scan')}><Text style={styles.actionSecondaryText}>Scan QR</Text></Pressable></View>
    <View style={styles.aiCard}><View style={{ flex: 1 }}><Text style={styles.aiLabel}>HOMELOG HELPER</Text><Text style={styles.aiTitle}>A little advice for your appliances</Text><Text style={styles.aiCopy}>Ask about service history or what to check next.</Text><Pressable onPress={() => router.push('/advice')}><Text style={styles.aiLink}>Ask HomeLog AI →</Text></Pressable></View><Text style={styles.aiSpark}>✦</Text></View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#f5f7f5', flex: 1 }, content: { padding: 22, paddingTop: 58, paddingBottom: 42 }, top: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, kicker: { color: '#259299', fontSize: 11, fontWeight: '800', letterSpacing: 2 }, title: { color: '#172c3e', fontSize: 28, fontWeight: '800', marginTop: 9 }, subtitle: { color: '#829097', fontSize: 14, marginTop: 5 }, avatar: { alignItems: 'center', backgroundColor: '#e4f1f1', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 }, avatarText: { color: '#218d94', fontSize: 18, fontWeight: '800' }, summary: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, padding: 16 }, summaryItem: { flex: 1 }, summaryValue: { color: '#172c3e', fontSize: 20, fontWeight: '800' }, summaryLabel: { color: '#829097', fontSize: 10, marginTop: 5 }, divider: { backgroundColor: '#edf0ef', height: 38, width: 1 }, sectionHead: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 }, sectionTitle: { color: '#203346', fontSize: 19, fontWeight: '800' }, seeAll: { color: '#278e96', fontSize: 13, fontWeight: '700' }, roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, roomCard: { borderRadius: 16, minHeight: 104, padding: 13, width: '48%' }, roomTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, roomIcon: { color: '#269198', fontSize: 24, fontWeight: '700' }, roomCount: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 10, color: '#516775', fontSize: 12, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3 }, roomName: { color: '#203346', fontSize: 14, fontWeight: '800', marginTop: 10 }, roomCaption: { color: '#829097', fontSize: 11, marginTop: 4 }, upcoming: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', marginBottom: 8, padding: 13 }, upcomingIcon: { alignItems: 'center', backgroundColor: '#e6f4f2', borderRadius: 13, height: 40, justifyContent: 'center', width: 40 }, upcomingGlyph: { color: '#278e96', fontSize: 20 }, upcomingText: { flex: 1, marginLeft: 12 }, upcomingTitle: { color: '#203346', fontSize: 14, fontWeight: '700' }, actions: { flexDirection: 'row', gap: 10, marginTop: 22 }, actionPrimary: { backgroundColor: '#278e96', borderRadius: 12, flex: 1, padding: 14 }, actionPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }, actionSecondary: { backgroundColor: '#fff', borderColor: '#dce6e3', borderRadius: 12, borderWidth: 1, padding: 14 }, actionSecondaryText: { color: '#278e96', fontSize: 14, fontWeight: '700' }, aiCard: { alignItems: 'center', backgroundColor: '#eaf3fa', borderRadius: 18, flexDirection: 'row', marginTop: 18, padding: 18 }, aiLabel: { color: '#368bc1', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }, aiTitle: { color: '#203346', fontSize: 16, fontWeight: '800', marginTop: 8 }, aiCopy: { color: '#72828e', fontSize: 12, lineHeight: 17, marginTop: 5 }, aiLink: { color: '#368bc1', fontSize: 13, fontWeight: '800', marginTop: 12 }, aiSpark: { color: '#368bc1', fontSize: 36, marginLeft: 10 } });
