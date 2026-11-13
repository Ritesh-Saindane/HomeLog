import { StyleSheet, Text, View } from 'react-native';

const currency = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function SpendingChart({ services }) {
  const today = new Date();
  const data = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    return { key, label: month.toLocaleDateString(undefined, { month: 'short' }), value: services.reduce((sum, service) => String(service.serviceDate).slice(0, 7) === key ? sum + Number(service.cost || 0) : sum, 0) };
  });
  const max = Math.max(1, ...data.map((item) => item.value));
  const current = data[data.length - 1]?.value || 0;
  return <View style={styles.card}><View style={styles.heading}><View><Text style={styles.kicker}>REPAIR & SERVICE</Text><Text style={styles.title}>Spending</Text></View><Text style={styles.total}>{currency(current)}</Text></View><View style={styles.chart}>{data.map((item, index) => <View key={item.key} style={styles.barColumn}><Text style={styles.amount}>{item.value ? currency(item.value) : ''}</Text><View style={styles.track}><View style={[styles.bar, { height: `${Math.max(item.value / max * 100, item.value ? 6 : 2)}%`, backgroundColor: index === data.length - 1 ? '#278e96' : '#b8dbd5' }]} /></View><Text style={styles.month}>{item.label}</Text></View>)}</View><Text style={styles.caption}>Monthly totals from saved service records</Text></View>;
}

const styles = StyleSheet.create({ card: { backgroundColor: '#fff', borderRadius: 18, marginTop: 18, padding: 17 }, heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, kicker: { color: '#829097', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#203346', fontSize: 18, fontWeight: '800', marginTop: 4 }, total: { color: '#278e96', fontSize: 18, fontWeight: '800' }, chart: { alignItems: 'flex-end', flexDirection: 'row', height: 138, justifyContent: 'space-around' }, barColumn: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }, amount: { color: '#829097', fontSize: 8, height: 14 }, track: { alignItems: 'center', height: 92, justifyContent: 'flex-end', width: '100%' }, bar: { borderRadius: 7, maxWidth: 24, minWidth: 15, width: '60%' }, month: { color: '#829097', fontSize: 10, marginTop: 7 }, caption: { color: '#9aa6aa', fontSize: 10, marginTop: 8 } });
