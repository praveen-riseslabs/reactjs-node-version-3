import { useState } from "react";
import { TextInput } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

function CTextInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder = "",
  showVisibilityBtn = false,
  placeholderTextColor = "gray",
  onBlur,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const type = secureTextEntry && isVisible ? "visible-password" : undefined;

  const onBtnClick = () => setIsVisible(!isVisible);

  return (
    <TextInput
      label={label}
      value={value}
      keyboardType={type}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      onBlur={onBlur}
      right={
        <TextInput.Icon
          icon={() => (
            <Entypo
              name={showVisibilityBtn && isVisible ? "eye-with-line" : "eye"}
              size={24}
              color="black"
            />
          )}
          onPress={onBtnClick}
        />
      }
      onChangeText={onChangeText}
    />
  );
}

export default CTextInput;
