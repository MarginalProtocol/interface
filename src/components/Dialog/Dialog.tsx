import { Fragment, useRef, useState } from "react"
import { Dialog as ReactDialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import useCloseOnExternalClick from "../../hooks/useCloseOnExternalClick"

export default function Dialog({
  id,
  isOpen,
  onClose,
  title,
  children,
}: {
  id: string
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const cancelButtonRef = useRef(null)

  const dialogRef = useRef(null)

  useCloseOnExternalClick(dialogRef, isOpen ? onClose : () => null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <ReactDialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-marginalBlack backdrop-blur-sm bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-end md:items-center justify-center min-h-full md:p-4 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <ReactDialog.Panel
                ref={dialogRef}
                className="relative w-full min-h-[80vh] md:min-h-0 md:max-w-sm md:my-8 overflow-hidden text-left transition-all transform border shadow-xl rounded-t-3xl md:rounded-3xl bg-marginalGray-900 border-marginalGray-800"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between p-4 text-xl tracking-thin font-bold text-marginalGray-200 uppercase">
                    <div>{title}</div>
                    <XMarkIcon
                      onClick={() => onClose()}
                      className="w-5 h-5 stroke-[3px] cursor-pointer hover:opacity-80"
                      aria-hidden="true"
                    />
                  </div>
                  <div>{children}</div>
                </div>
              </ReactDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </ReactDialog>
    </Transition.Root>
  )
}
