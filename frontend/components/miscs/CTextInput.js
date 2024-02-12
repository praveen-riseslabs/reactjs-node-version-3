import { TextInput } from "react-native-paper";
import { COLORS } from "../../constants";
import { View } from "react-native";
import { useState } from "react";

function CTextInput({
  placeholder,
  placeholderTextColor,
  label,
  secureTextEntry,
  showVisibilityBtn,
  value,
  onChangeText,
  onBlur,
}) {
  const [eyeBtn, setEyeBtn] = useState(false);

  const toggleEyeBtn = () => setEyeBtn(!eyeBtn);

  return (
    <View style={{ marginTop: 10 }}>
      <TextInput
        placeholderTextColor={placeholderTextColor}
        activeUnderlineColor={COLORS.primary}
        label={label}
        value={value}
        placeholder={placeholder}
        onChangeText={(e) => onChangeText(e)}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry && eyeBtn}
        right={
          showVisibilityBtn ? (
            <TextInput.Icon
              icon={eyeBtn ? "eye" : "eye-off"}
              onPress={toggleEyeBtn}
            />
          ) : null
        }
      />
    </View>
  );
}

export default CTextInput;
