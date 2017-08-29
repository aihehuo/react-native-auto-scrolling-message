import React from 'react';
import { Text, View, Animated, Easing } from 'react-native';

// props [duration, height, containerStyle]
export default class RollingMessage extends React.Component {
  constructor (props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.animatedValue = new Animated.Value(0)
    this.height = props.height || 40
    this.state = {
      currentIndex: 0
    }
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: this.props.duration || 2000,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({currentIndex: (this.state.currentIndex + 1) % this.props.children.length})
      this.animate()
    })
  }

  render() {
    const { currentIndex } = this.state
    const { containerStyle } = this.props
    const top = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, this.height / 2, this.height / 2, this.height / 2, this.height]
    })
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, 0.9, 1, 0.9, 0]
    })
    return (
      <View style={[{
        height: this.height,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }, containerStyle]}>
        <Animated.View style={{
          position: 'absolute',
          top,
          opacity
        }}>{this.props.children[currentIndex]}</Animated.View>
      </View>
    );
  }
}
