import React from 'react';
import Svg, { Circle, Text as SvgText, Line } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

// Komponen Speedometer
const Speedometer = ({ value = 0, max = 100 }) => {
  const size = 200; // Diameter speedometer
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Hitung progres
  const progress = Math.min(Math.max(value / max, 0), 1); // 0 hingga 1
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.speedometerContainer}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#28a745"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        {/* Center Value */}
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#fff"
          dy="8" // Adjust for better alignment
        >
          {Math.round(value)}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  speedometerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Speedometer;
