import {View, StyleSheet, ActivityIndicator} from 'react-native';
import { color } from '../config/color';

function Loader() {
  return (
    <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color={color.secondary} />
    </View>
  )
}

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        flex: 1,
        backgroundColor: color.primary
    }
});