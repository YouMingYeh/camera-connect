import * as React from "react"
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native"
import { Icon } from "../components/Icon"
import { IconButton } from "../components/IconButton"
import { editingModeState } from "../Store"
import { useRecoilState } from "recoil"
import { useContext , useMemo } from "react"
import { EditorContext } from ".."
const operations = {
  transform: [
    {
      title: "Crop",
      iconID: "crop",
      operationID: "crop",
    },
    {
      title: "Rotate",
      iconID: "rotate-90-degrees-ccw",
      operationID: "rotate",
    },
  ],
  adjust: [
    {
      title: "Blur",
      iconID: "blur-on",
      operationID: "blur",
    },
  ],
}
export function OperationSelection() {
  //
  const { allowedTransformOperations, allowedAdjustmentOperations } = useContext(EditorContext)
  const isTransformOnly = allowedTransformOperations && !allowedAdjustmentOperations
  const isAdjustmentOnly = allowedAdjustmentOperations && !allowedTransformOperations
  const [selectedOperationGroup, setSelectedOperationGroup] = React.useState(
    isAdjustmentOnly ? "adjust" : "transform",
  )
  const [, setEditingMode] = useRecoilState(editingModeState)
  const filteredOperations = useMemo(() => {
    // If neither are specified then allow the full range of operations
    if (!allowedTransformOperations && !allowedAdjustmentOperations) {
      return operations
    }

    const filteredTransforms = allowedTransformOperations
      ? operations.transform.filter((op) => allowedTransformOperations.includes(op.operationID))
      : operations.transform
    const filteredAdjustments = allowedAdjustmentOperations
      ? operations.adjust.filter((op) => allowedAdjustmentOperations.includes(op.operationID))
      : operations.adjust

    if (isTransformOnly) {
      return {
        transform: filteredTransforms,
        adjust: [],
      }
    }

    if (isAdjustmentOnly) {
      return {
        adjust: filteredAdjustments,
        transform: [],
      }
    }

    return {
      transform: filteredTransforms,
      adjust: filteredAdjustments,
    }
  }, [allowedTransformOperations, allowedAdjustmentOperations, isTransformOnly, isAdjustmentOnly])
  return /* #__PURE__ */ React.createElement(
    React.Fragment,
    null,
    /* #__PURE__ */ React.createElement(
      ScrollView,
      {
        style: styles.opRow,
        horizontal: true,
      }, // @ts-ignore
      filteredOperations[selectedOperationGroup].map((item, index) =>
        /* #__PURE__ */ React.createElement(
          View,
          {
            style: styles.opContainer,
            key: item.title,
          },
          /* #__PURE__ */ React.createElement(IconButton, {
            text: item.title,
            iconID: item.iconID,
            onPress: () => setEditingMode(item.operationID),
          }),
        ),
      ),
    ),
    !isTransformOnly && !isAdjustmentOnly
      ? /* #__PURE__ */ React.createElement(
          View,
          {
            style: styles.modeRow,
          },
          /* #__PURE__ */ React.createElement(
            TouchableOpacity,
            {
              style: [
                styles.modeButton,
                selectedOperationGroup === "transform" && {
                  backgroundColor: "#333",
                },
              ],
              onPress: () => setSelectedOperationGroup("transform"),
            },
            /* #__PURE__ */ React.createElement(Icon, {
              iconID: "transform",
              text: "Transform",
            }),
          ),
          /* #__PURE__ */ React.createElement(
            TouchableOpacity,
            {
              style: [
                styles.modeButton,
                selectedOperationGroup === "adjust" && {
                  backgroundColor: "#333",
                },
              ],
              onPress: () => setSelectedOperationGroup("adjust"),
            },
            /* #__PURE__ */ React.createElement(Icon, {
              iconID: "tune",
              text: "Adjust",
            }),
          ),
        )
      : null,
  )
}
const styles = StyleSheet.create({
  modeButton: {
    alignItems: "center",
    backgroundColor: "#222",
    flex: 1,
    height: 80,
    justifyContent: "center",
  },
  modeRow: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    width: "100%",
  },
  opContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    marginLeft: 16,
  },
  opRow: {
    backgroundColor: "#333",
    height: 80,
    width: "100%",
  },
})
// # sourceMappingURL=OperationSelection.js.map
