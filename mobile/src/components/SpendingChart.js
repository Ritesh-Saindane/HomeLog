import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

const currency = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function SpendingChart({ services }) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => new Date(today.getFullYear(), today.getMonth() - 5 + index, 1));
  const data = months.map((month) => {
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    const amount = services.reduce((sum, service) => String(service.serviceDate).slice(0, 7) === key ? sum + Number(service.cost || 0) : sum, 0);
    return { key, month: month.toLocaleDateString(undefined, { month: 'short' }), amount };
  });
  const max = Math.max(...data.map((item) => item.amount), 1);
  const width = 310;
  const chartHeight = 138;
  const barWidth = 24;
  const gap = (width - barWidth * data.length) / (data.length * 2);
  const current = data[data.length - 1]?.amount || 0;
  return <View style={styles.card}><View style={styles.heading}><View><Text style={styles.kicker}>REPAIR & SERVICE</Text><Text style={styles.title}>Spending</Text></View><Text style={styles.total}>{currency(current)}</Text></View><Svg width="100%" height={chartHeight + 32} viewBox={`0 0 ${width} ${chartHeight + 32}`}><Line x1="0" y1={chartHeight} x2={width} y2={chartHeight} stroke="#e8eeec" strokeWidth="1" />{data.map((item, index) => { const height = item.amount ? Math.max((item.amount / max) * 92, 5) : 3; const x = gap + index * (barWidth + gap * 2); const y = chartHeight - height; return <><Rect key={`${item.key}-bar`} x={x} y={y} width={barWidth} height={height} rx="8" fill={index === data.length - 1 ? '#278e96' : '#b8dbd5'} /><SvgText key={`${item.key}-label`} x={x + barWidth / 2} y={chartHeight + 20} fontSize="10" fill="#829097" textAnchor="middle">{item.month}</SvgText></>; })}</Svg><Text style={styles.caption}>Monthly totals from saved service records</Text></View>;
}

const styles = StyleSheet.create({ card: { backgroundColor: '#fff', borderRadius: 18, marginTop: 18, padding: 17 }, heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, kicker: { color: '#829097', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#203346', fontSize: 18, fontWeight: '800', marginTop: 4 }, total: { color: '#278e96', fontSize: 18, fontWeight: '800' }, caption: { color: '#9aa6aa', fontSize: 10, marginTop: 2 } });

