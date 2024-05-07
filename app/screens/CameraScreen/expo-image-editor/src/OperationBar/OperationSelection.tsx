/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import * as React from "react"
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native"
import { Icon } from "../components/Icon"
import { IconButton } from "../components/IconButton"
import { editingModeState, EditingModes } from "../Store"
import { useRecoilState } from "recoil"
import { useContext , useMemo } from "react"
import { AdjustmentOperations, EditingOperations, EditorContext, TransformOperations } from ".."

interface Operation<T> {
  title: string
  iconID: React.ComponentProps<typeof Icon>["iconID"]
  operationID: T
}

interface Operations {
  transform: Operation<TransformOperations>[]
  adjust: Operation<AdjustmentOperations>[]
}

const operations: Operations = {
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
    {
      title: "Filter",
      iconID: "filter",
      operationID: "filter",
    },
  ],
}

export function OperationSelection() {
  //
  const { allowedTransformOperations, allowedAdjustmentOperations } = useContext(EditorContext)

  const isTransformOnly = allowedTransformOperations && !allowedAdjustmentOperations
  const isAdjustmentOnly = allowedAdjustmentOperations && !allowedTransformOperations

  const [selectedOperationGroup, setSelectedOperationGroup] = React.useState<
    "transform" | "adjust"
  >(isAdjustmentOnly ? "adjust" : "transform")

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
      return { transform: filteredTransforms, adjust: [] }
    }
    if (isAdjustmentOnly) {
      return { adjust: filteredAdjustments, transform: [] }
    }
    return { transform: filteredTransforms, adjust: filteredAdjustments }
  }, [allowedTransformOperations, allowedAdjustmentOperations, isTransformOnly, isAdjustmentOnly])

  return (
    <>
      <ScrollView style={styles.opRow} horizontal>
        {filteredOperations[selectedOperationGroup].map(
          (item: Operation<EditingOperations>, index: number) => (
            <View style={styles.opContainer} key={item.title}>
              <IconButton
                text={item.title}
                iconID={item.iconID}
                onPress={() => setEditingMode(item.operationID)}
              />
            </View>
          ),
        )}
      </ScrollView>
      {!isTransformOnly && !isAdjustmentOnly ? (
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              selectedOperationGroup === "transform" && {
                backgroundColor: "black",
              },
            ]}
            onPress={() => setSelectedOperationGroup("transform")}
          >
            <Icon
              iconID="transform"
              text="Transform"
              disabled={selectedOperationGroup !== "transform"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              selectedOperationGroup === "adjust" && {
                backgroundColor: "black",
              },
            ]}
            onPress={() => setSelectedOperationGroup("adjust")}
          >
            <Icon iconID="tune" text="Adjust" disabled={selectedOperationGroup !== "adjust"} />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  modeButton: {
    alignItems: "center",
    backgroundColor: "black",
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
    height: 80,
    width: "100%",
    // backgroundColor: "#333",
  },
})
