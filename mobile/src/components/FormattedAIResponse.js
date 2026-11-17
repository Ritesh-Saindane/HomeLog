import { StyleSheet, Text, View } from 'react-native';

function inlineParts(value, colors) {
  const parts = String(value).split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[[^\]]+\]\([^)]*\))/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <Text key={index} style={styles.bold}>{part.slice(2, -2)}</Text>;
    if (part.startsWith('*') && part.endsWith('*')) return <Text key={index} style={styles.italic}>{part.slice(1, -1)}</Text>;
    if (part.startsWith('`') && part.endsWith('`')) return <Text key={index} style={[styles.code, { backgroundColor: colors.input, color: colors.text }]}>{part.slice(1, -1)}</Text>;
    if (part.startsWith('[')) return <Text key={index}>{part.replace(/^\[([^\]]+)\]\([^)]*\)$/, '$1')}</Text>;
    return <Text key={index}>{part}</Text>;
  });
}

function isTableSeparator(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

export function FormattedAIResponse({ text, colors }) {
  const output = [];
  let paragraph = [];
  let table = [];
  let inCode = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    output.push(<Text key={`paragraph-${output.length}`} style={[styles.paragraph, { color: colors.text }]}>{inlineParts(paragraph.join(' '), colors)}</Text>);
    paragraph = [];
  }

  function flushTable() {
    if (!table.length) return;
    output.push(<View key={`table-${output.length}`} style={[styles.table, { borderColor: colors.border }]}>{table.map((row, rowIndex) => <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && styles.tableHeader, { borderBottomColor: colors.border }]}>{row.map((cell, cellIndex) => <Text key={cellIndex} style={[styles.tableCell, { color: colors.text }]}>{inlineParts(cell.trim(), colors)}</Text>)}</View>)}</View>);
    table = [];
  }

  String(text || '').replace(/\r/g, '').split('\n').forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (line.startsWith('```')) { flushParagraph(); flushTable(); inCode = !inCode; return; }
    if (inCode) { paragraph.push(rawLine); return; }
    if (!line) { flushParagraph(); flushTable(); return; }
    if (/^\s*\|.*\|\s*$/.test(rawLine)) {
      flushParagraph();
      if (!isTableSeparator(line)) table.push(line.replace(/^\|/, '').replace(/\|$/, '').split('|'));
      return;
    }
    flushTable();
    const heading = line.match(/^#{1,6}\s+(.+)/);
    const bullet = line.match(/^[-*+]\s+(.+)/);
    const numbered = line.match(/^(\d+)[.)]\s+(.+)/);
    if (/^[-*_]{3,}$/.test(line)) { flushParagraph(); return; }
    if (heading) { flushParagraph(); output.push(<Text key={`heading-${index}`} style={[styles.heading, { color: colors.text }]}>{inlineParts(heading[1], colors)}</Text>); return; }
    if (bullet) { flushParagraph(); output.push(<View key={`bullet-${index}`} style={styles.listRow}><Text style={[styles.bullet, { color: colors.accent }]}>•</Text><Text style={[styles.listText, { color: colors.text }]}>{inlineParts(bullet[1], colors)}</Text></View>); return; }
    if (numbered) { flushParagraph(); output.push(<View key={`number-${index}`} style={styles.listRow}><Text style={[styles.number, { color: colors.accent }]}>{numbered[1]}.</Text><Text style={[styles.listText, { color: colors.text }]}>{inlineParts(numbered[2], colors)}</Text></View>); return; }
    paragraph.push(line);
  });
  flushParagraph();
  flushTable();
  return <View style={styles.response}>{output}</View>;
}

const styles = StyleSheet.create({ response: { gap: 8 }, paragraph: { fontSize: 14, lineHeight: 22 }, heading: { fontSize: 15, fontWeight: '800', lineHeight: 22, marginTop: 3 }, listRow: { alignItems: 'flex-start', flexDirection: 'row' }, bullet: { fontSize: 18, fontWeight: '800', lineHeight: 21, marginRight: 8 }, number: { fontSize: 13, fontWeight: '800', lineHeight: 22, marginRight: 8, minWidth: 18 }, listText: { flex: 1, fontSize: 14, lineHeight: 22 }, bold: { fontWeight: '800' }, italic: { fontStyle: 'italic' }, code: { borderRadius: 4, fontFamily: 'monospace', paddingHorizontal: 3 }, table: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' }, tableRow: { borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 8 }, tableHeader: { backgroundColor: 'rgba(128, 150, 160, 0.12)' }, tableCell: { flex: 1, fontSize: 12, lineHeight: 18, paddingHorizontal: 8 } });
