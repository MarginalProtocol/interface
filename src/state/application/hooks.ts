import { useCallback } from "react"
import { ApplicationModal, setOpenModal } from "./reducer"
import { useAppSelector, useAppDispatch } from "../../store/hooks"
import { AppState } from "../../store"

export const useApplicationState = (): AppState["application"] => {
  return useAppSelector((state) => state.application)
}

export function useModalIsOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const isOpen = useModalIsOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(
    () => dispatch(setOpenModal(isOpen ? null : modal)),
    [dispatch, modal, isOpen],
  )
}

export function useCloseModal() {
  const dispatch = useAppDispatch()
  const currentlyOpenModal = useAppSelector(
    (state: AppState) => state.application.openModal,
  )
  return useCallback(
    (modalToClose?: ApplicationModal) => {
      if (!modalToClose) {
        // Close any open modal if no modal is specified.
        dispatch(setOpenModal(null))
      } else if (currentlyOpenModal === modalToClose) {
        // Close the currently open modal if it is the one specified.
        dispatch(setOpenModal(null))
      }
    },
    [currentlyOpenModal, dispatch],
  )
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useToggleTokenList(): () => void {
  return useToggleModal(ApplicationModal.TOKEN_LIST)
}
