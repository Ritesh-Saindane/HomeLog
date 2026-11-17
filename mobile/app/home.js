import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useAssets } from '../src/context/AssetContext';
import { api } from '../src/services/api';
import { syncUserNotifications } from '../src/services/notifications';
import { TodoPanel } from '../src/components/TodoPanel';
import { SpendingChart } from '../src/components/SpendingChart';
import { useTheme } from '../src/context/ThemeContext';

const rooms = [
  { name: 'Living room', icon: '🛋️', color: '#e7f2fc' },
  { name: 'Kitchen', icon: '🍳', color: '#e7f5f0' },
  { name: 'Bedroom', icon: '🛏️', color: '#f0ecfb' },
  { name: 'Bathroom', icon: '🛁', color: '#e9f5f6' },
  { name: 'Study room', icon: '📚', color: '#fbf1e4' },
  { name: 'Other', icon: '📦', color: '#f1f3f3' },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { assets, isLoading, refresh } = useAssets();
  const { colors, darkMode } = useTheme();
  const [customRooms, setCustomRooms] = useState([]);
  const [roomDraft, setRoomDraft] = useState('');
  const [roomIconDraft, setRoomIconDraft] = useState('🏠');
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [services, setServices] = useState([]);
  useFocusEffect(useCallback(() => {
    let active = true;
    async function loadDashboard() {
      const currentAssets = await refresh();
      if (isLoading || !currentAssets?.length) { if (active && currentAssets) { setSchedules([]); setServices([]); } return; }
      syncUserNotifications(currentAssets, api).catch(() => {});
      const results = await Promise.all(currentAssets.map(async (asset) => {
      const [scheduleResult, serviceResult] = await Promise.all([
        api.get(`/assets/${asset.id}/maintenance`).catch(() => ({ data: [] })),
        api.get(`/assets/${asset.id}/services`).catch(() => ({ data: [] })),
      ]);
      return { asset, schedules: scheduleResult.data, services: serviceResult.data };
      }));
      if (!active) return;
      setSchedules(results.flatMap(({ asset, schedules: items }) => items.map((item) => ({ ...item, assetName: asset.name }))));
      setServices(results.flatMap(({ asset, services: items }) => items.map((item) => ({ ...item, assetName: asset.name }))));
    }
    loadDashboard();
    return () => { active = false; };
  }, [isLoading, refresh]));
  const monthSpend = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return services.filter((item) => String(item.serviceDate).slice(0, 7) === monthKey).reduce((sum, item) => sum + Number(item.cost || 0), 0);
  }, [services]);
  const activeSchedules = schedules.filter((item) => item.isActive);
  const roomsWithAssets = rooms.map((room) => ({ ...room, count: assets.filter((asset) => (asset.location || 'Other') === room.name).length }));
  useFocusEffect(useCallback(() => { AsyncStorage.getItem('@homelog/custom_rooms').then((value) => setCustomRooms(value ? JSON.parse(value) : [])).catch(() => {}); }, []));
  async function addCustomRoom() { const name = roomDraft.trim(); if (!name || roomsWithAssets.some((room) => room.name.toLowerCase() === name.toLowerCase()) || customRooms.some((room) => room.name.toLowerCase() === name.toLowerCase())) return; const next = [...customRooms, { name, icon: roomIconDraft.trim() || '🏠', color: '#eaf2ef' }]; setCustomRooms(next); await AsyncStorage.setItem('@homelog/custom_rooms', JSON.stringify(next)); setRoomDraft(''); setRoomIconDraft('🏠'); setShowRoomInput(false); }

  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><View style={styles.headerCopy}><Image source={darkMode ? require('../assets/homelog-mark-dark.png') : require('../assets/homelog-mark-light.png')} resizeMode="contain" style={{ alignSelf: 'flex-start', height: 72, width: 72 }} /><Text style={[styles.title, { color: colors.text }]}>Good day{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>A little care keeps home running.</Text></View><Pressable onPress={logout} style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text></Pressable></View>
    <View style={[styles.summary, { backgroundColor: colors.card }]}><View style={styles.summaryItem}><Text style={[styles.summaryValue, { color: colors.text }]}>{activeSchedules.length}</Text><Text style={[styles.summaryLabel, { color: colors.muted }]}>Upcoming care</Text></View><View style={styles.divider}/><View style={styles.summaryItem}><Text style={[styles.summaryValue, { color: colors.text }]}>₹{monthSpend.toLocaleString('en-IN')}</Text><Text style={[styles.summaryLabel, { color: colors.muted }]}>Service this month</Text></View></View>
    <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.text }]}>Rooms</Text><Pressable onPress={() => router.push('/assets')}><Text style={styles.seeAll}>All assets ›</Text></Pressable></View>
    <View style={styles.roomGrid}>{[...roomsWithAssets, ...customRooms.map((room) => ({ ...room, count: assets.filter((asset) => asset.location === room.name).length }))].map((room) => <Pressable key={room.name} onPress={() => router.push({ pathname: '/assets', params: { room: room.name } })} style={[styles.roomCard, { backgroundColor: colors.card }]}><View style={styles.roomTop}><Text style={styles.roomIcon}>{room.icon}</Text><Text style={styles.roomCount}>{room.count}</Text></View><Text style={[styles.roomName, { color: colors.text }]}>{room.name}</Text><Text style={[styles.roomCaption, { color: colors.muted }]}>{room.count === 1 ? '1 asset' : `${room.count} assets`}</Text></Pressable>)}</View>
    {showRoomInput ? <View style={styles.newRoom}><TextInput value={roomIconDraft} onChangeText={setRoomIconDraft} placeholder="Icon" placeholderTextColor={colors.muted} style={[styles.roomIconInput, { backgroundColor: colors.card, color: colors.text }]} /><TextInput value={roomDraft} onChangeText={setRoomDraft} placeholder="Custom room name" placeholderTextColor={colors.muted} style={[styles.roomInput, { backgroundColor: colors.card, color: colors.text }]} /><Pressable onPress={addCustomRoom}><Text style={styles.seeAll}>Save</Text></Pressable><Pressable onPress={() => setShowRoomInput(false)}><Text style={styles.roomCaption}>Cancel</Text></Pressable></View> : <Pressable onPress={() => setShowRoomInput(true)} style={styles.addRoom}><Text style={styles.seeAll}>＋ Add a custom room</Text></Pressable>}
    <TodoPanel schedules={activeSchedules} assets={assets} />
    <SpendingChart services={services} />
    <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.text }]}>Coming up</Text><Pressable onPress={() => router.push('/timeline')}><Text style={styles.seeAll}>Timeline ›</Text></Pressable></View>
    {activeSchedules.slice(0, 2).map((item) => <Pressable key={item.id} onPress={() => router.push(`/assets/${item.assetId}`)} style={[styles.upcoming, { backgroundColor: colors.card }]}><View style={styles.upcomingIcon}><Text style={styles.upcomingGlyph}>◷</Text></View><View style={styles.upcomingText}><Text style={[styles.upcomingTitle, { color: colors.text }]}>{item.title}</Text><Text style={[styles.roomCaption, { color: colors.muted }]}>{item.assetName} · {String(item.nextDueDate).slice(0, 10)}</Text></View></Pressable>)}
    <View style={styles.actions}><Pressable style={styles.actionPrimary} onPress={() => router.push('/assets/new')}><Text style={styles.actionPrimaryText}>＋ Add an asset</Text></Pressable><Pressable style={styles.actionSecondary} onPress={() => router.push('/scan')}><Text style={styles.actionSecondaryText}>Scan QR</Text></Pressable></View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#f5f7f5', flex: 1 }, content: { padding: 22, paddingTop: 58, paddingBottom: 28 }, top: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }, headerCopy: { alignItems: 'flex-start', flex: 1 }, homeLogo: { alignSelf: 'flex-start', height: 42, width: 175 }, kicker: { color: '#259299', fontSize: 11, fontWeight: '800', letterSpacing: 2 }, title: { color: '#172c3e', fontSize: 28, fontWeight: '800', marginTop: 9 }, subtitle: { color: '#829097', fontSize: 14, marginTop: 5 }, avatar: { alignItems: 'center', backgroundColor: '#e4f1f1', borderRadius: 22, height: 44, justifyContent: 'center', marginTop: 4, width: 44 }, avatarText: { color: '#218d94', fontSize: 18, fontWeight: '800' }, summary: { alignItems: 'center', borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, padding: 16 }, summaryItem: { flex: 1 }, summaryValue: { fontSize: 20, fontWeight: '800' }, summaryLabel: { color: '#829097', fontSize: 10, marginTop: 5 }, divider: { backgroundColor: '#edf0ef', height: 38, width: 1 }, sectionHead: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 }, sectionTitle: { color: '#203346', fontSize: 19, fontWeight: '800' }, seeAll: { color: '#278e96', fontSize: 13, fontWeight: '700' }, roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, roomCard: { borderRadius: 16, minHeight: 104, padding: 13, width: '48%' }, roomTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, roomIcon: { fontSize: 24, fontWeight: '700' }, roomCount: { backgroundColor: 'rgba(120,160,145,0.18)', borderRadius: 10, color: '#516775', fontSize: 12, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3 }, roomName: { fontSize: 14, fontWeight: '800', marginTop: 10 }, roomCaption: { color: '#829097', fontSize: 11, marginTop: 4 }, upcoming: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', marginBottom: 8, padding: 13 }, upcomingIcon: { alignItems: 'center', backgroundColor: '#e6f4f2', borderRadius: 13, height: 40, justifyContent: 'center', width: 40 }, upcomingGlyph: { color: '#278e96', fontSize: 20 }, upcomingText: { flex: 1, marginLeft: 12 }, upcomingTitle: { color: '#203346', fontSize: 14, fontWeight: '700' }, actions: { flexDirection: 'row', gap: 10, marginTop: 22 }, actionPrimary: { backgroundColor: '#278e96', borderRadius: 12, flex: 1, padding: 14 }, actionPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }, actionSecondary: { backgroundColor: '#fff', borderColor: '#dce6e3', borderRadius: 12, borderWidth: 1, padding: 14 }, actionSecondaryText: { color: '#278e96', fontSize: 14, fontWeight: '700' }, newRoom: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }, roomInput: { borderRadius: 10, flex: 1, padding: 12 }, roomIconInput: { borderRadius: 10, minWidth: 55, padding: 12, textAlign: 'center' }, addRoom: { alignSelf: 'flex-start', marginTop: 12, padding: 7 } });
