import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@has_seen_onboarding';

interface SlideData {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradientColors: string[];
}

const slides: SlideData[] = [
  {
    id: '1',
    icon: 'cloud-upload',
    title: 'Upload Documents',
    description: 'Select PDFs, DOCs, or images from your phone. We support all popular formats.',
    gradientColors: ['#4F46E5', '#7C3AED'],
  },
  {
    id: '2',
    icon: 'options',
    title: 'Customize Your Print',
    description: 'Choose single or double-sided, black & white or color, binding options and more.',
    gradientColors: ['#7C3AED', '#06B6D4'],
  },
  {
    id: '3',
    icon: 'rocket',
    title: 'Get It Delivered',
    description: 'Free delivery on orders above ₹199. Pick up for free from our nearest outlet.',
    gradientColors: ['#06B6D4', '#4F46E5'],
  },
];

interface OnboardingScreenProps {
  navigation: any;
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }: { item: SlideData }) => {
    const inputRange = [
      (parseInt(item.id) - 1) * width,
      parseInt(item.id) * width,
      (parseInt(item.id) + 1) * width,
    ];

    const iconScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <LinearGradient
        colors={item.gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slide}
      >
        <View style={styles.slideContent}>
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: iconScale }] },
            ]}
          >
            <Ionicons name={item.icon} size={80} color={Colors.white} />
          </Animated.View>
          <Animated.Text style={[styles.slideTitle, { opacity: textOpacity }]}>
            {item.title}
          </Animated.Text>
          <Animated.Text style={[styles.slideDescription, { opacity: textOpacity }]}>
            {item.description}
          </Animated.Text>
        </View>
      </LinearGradient>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor:
                    index === currentIndex ? Colors.white : 'rgba(255,255,255,0.4)',
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {renderDots()}

        {isLastSlide ? (
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="secondary"
            size="large"
            style={styles.getStartedButton}
          />
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  getStartedButton: {
    width: width - 80,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  nextText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
