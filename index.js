import React from 'react';
import { Text, View, Animated, Easing } from 'react-native';

// props [duration, height, containerStyle]
export default class RollingMessage extends React.Component {
  constructor (props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.animatedValue = new Animated.Value(0)
    this.height = props.height || 40
    this.childrenHeight = props.childrenHeight || 20
    this.centerPosition = (this.height - this.childrenHeight) / 2
    this.dataIsArray = props.children.length && props.children.length > 1
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
      if (this.dataIsArray) {
        this.setState({currentIndex: (this.state.currentIndex + 1) % this.props.children.length})
      }
      this.animate()
    })
  }

  render() {
    const { currentIndex } = this.state
    const { containerStyle, childrenStyle } = this.props
    const top = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, this.centerPosition, this.centerPosition, this.centerPosition, this.height - this.childrenHeight]
    })
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [0, 0.9, 1, 0.9, 0]
    })
    return (
      <View style={[{
        height: this.height,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }, containerStyle]}>
        <Animated.View style={[{
          position: 'absolute',
          height: this.childrenHeight,
          top,
          opacity
        }, childrenStyle]}>{this.dataIsArray ? this.props.children[currentIndex] : this.props.children}</Animated.View>
      </View>
    );
  }
}
