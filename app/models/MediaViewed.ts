import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const MediaViewedModel = types
  .model("MediaViewed")
  .props({
    mediaIds: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get mediaIdsSet() {
      return new Set(self.mediaIds)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addMediaId(mediaId: string) {
      self.mediaIds.push(mediaId)
    },
    removeMediaId(mediaId: string) {
      self.mediaIds.remove(mediaId)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface MediaViewed extends Instance<typeof MediaViewedModel> {}
export interface MediaViewedSnapshotOut extends SnapshotOut<typeof MediaViewedModel> {}
export interface MediaViewedSnapshotIn extends SnapshotIn<typeof MediaViewedModel> {}
export const createMediaViewedDefaultModel = () => types.optional(MediaViewedModel, {})
