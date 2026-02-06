import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useTheme from "../../theme/useTheme";
import { Pressable } from "@react-native-material/core";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Line from '../Line';
import useGlobalStore from '../../data/zustand/useGlobalStore';
const ListItem = ({ firstText, centerText, endText, notIcon, priceText, priceBottomText, iconBasket, notPriceIcon, statusText, status, onPress, onLongPress, index, markId, indexIsButtonIcon, indexIsButtonIconPress, deactiveStatus }) => {

  let theme = useTheme();
  let marks = useGlobalStore(state => state.marks);

  // markId varsa, ilgili mark bilgisini al
  const currentMark = markId ? marks.find(mark => mark.Id == markId) : null;

  const opacity = deactiveStatus ? 0.5 : 1;

  return (
    <>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flex: 1,
          minHeight: 70,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          opacity: opacity
        }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {
            !indexIsButtonIcon ?
              (<View style={{
                width: 20,
                height: 20,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: status == undefined ? theme.primary : status ? theme.primary : theme.red,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: status == undefined ? theme.primary : status ? theme.primary : theme.red, fontSize: 10 }}>{index}</Text>
              </View>)
              :
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={indexIsButtonIconPress}
              >
                {
                  indexIsButtonIcon
                }
              </TouchableOpacity>
          }
        </View>
        <View style={{
          flex: 5,
          justifyContent: 'center',
          gap: 2
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            width: '85%',
          }}>
            {
              firstText != undefined ?
                <Text style={{
                  fontSize: 12
                }}>{firstText}</Text>
                :
                ""
            }
            {
              statusText != undefined ?
                <Text style={{
                  fontSize: 10,
                  color: status ? theme.green : theme.red,
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderColor: status ? theme.green : theme.red
                }}>{statusText}</Text>
                : ""
            }
            {
              currentMark != null ?
                <View style={{
                  backgroundColor: currentMark.Color,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}>
                  <Text style={{
                    fontSize: 10,
                    color: '#fff',
                  }}>{currentMark.Name}</Text>
                </View>
                : ""
            }
          </View>
          {
            centerText != undefined ?
              <Text style={{
                color: 'black'
              }}>{centerText}</Text>
              :
              ""
          }
          {
            endText != undefined ?
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                {
                  !notIcon ?
                    !iconBasket ?
                      <FontAwesome size={10} name='cube' color={endText > 0 ? theme.greeb : theme.red} />
                      :
                      <SimpleLineIcons size={10} name='basket' color={endText > 0 ? theme.green : theme.red} />
                    :
                    ""

                }
                <Text style={[{
                  fontSize: 12
                }, !notIcon && { color: endText > 0 ? theme.green : theme.red }]}>{endText}</Text>
              </View>
              :
              ""
          }
        </View>
        <View style={{
          flex: 2,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 10
        }}>
          {
            priceText != undefined ?
              <Text style={{
                color: theme.black
              }}>{priceText} {!notPriceIcon && '₼'}</Text>
              :
              ""
          }
          {
            priceBottomText != undefined ?
              <Text style={{
                color: theme.black,
                fontSize: 12
              }}>{priceBottomText} {!notPriceIcon && '₼'}</Text>
              :
              ""
          }
        </View>
      </Pressable>
      <Line width={'100%'} />
    </>
  )
}

export default ListItem

const styles = StyleSheet.create({})