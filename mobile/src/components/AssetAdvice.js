import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../services/api';

export function AssetAdvice({ asset }) {
  const [question, setQuestion] = useState('What should I check or service next?');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function ask() { setLoading(true); setAnswer(''); setError(''); try { const response = await api.post('/advice', { assetId: asset.id, question }); setAnswer(response.data.answer); } catch (e) { setError(e.response?.data?.error || 'Could not get advice right now.'); } finally { setLoading(false); } }
  return <View style={styles.card}><Text style={styles.title}>Advice for this {asset.category.toLowerCase()}</Text><Text style={styles.hint}>Recommendations use only this appliance’s saved service history.</Text><TextInput value={question} onChangeText={setQuestion} style={styles.input} multiline placeholder="Ask about repairs or maintenance" placeholderTextColor="#89999b" /><Pressable onPress={ask} disabled={loading} style={styles.button}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ask HomeLog AI</Text>}</Pressable>{error ? <Text style={styles.error}>{error}</Text> : null}{answer ? <Text style={styles.answer}>{answer}</Text> : null}</View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: '#eaf3fa', borderRadius: 18, marginBottom: 16, padding: 18 }, title: { color: '#203346', fontSize: 17, fontWeight: '800' }, hint: { color: '#72828e', fontSize: 12, lineHeight: 18, marginTop: 6 }, input: { backgroundColor: '#fff', borderRadius: 11, color: '#203346', marginTop: 14, minHeight: 76, padding: 12, textAlignVertical: 'top' }, button: { alignItems: 'center', backgroundColor: '#368bc1', borderRadius: 11, marginTop: 10, minHeight: 44, justifyContent: 'center' }, buttonText: { color: '#fff', fontWeight: '800' }, answer: { color: '#203346', fontSize: 14, lineHeight: 22, marginTop: 15 }, error: { color: '#a4483c', marginTop: 12 } });
