import { Separator } from '../../../components/ui/separator'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { useUser } from '../../../context/user-context'
import { LoginModal } from '../modals/login-modal'
import { SignupModal } from '../modals/sign-up-modal'

import { Repeat2 } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  enum ModalType {
    NONE = 0,
    LOGIN = 1,
    SIGNUP = 2,
  }

  const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE)
  const { isAuthenticated, handleSignup, handleLogin, handleLogout } = useUser()

  return (
    <Modal
      open={openModal !== ModalType.NONE}
      onOpenChange={() => setOpenModal(ModalType.NONE)}
    >
      <header className="flex flex-col sticky top-0 bg-stone-950 z-40">
        <div className="flex items-center justify-between gap-2 py-2 px-10">
          <div className="flex items-center justify-start gap-2 text-orange-500">
            <Repeat2 className="size-7" />

            <span className="text-lg font-semibold">Loop</span>
          </div>

          <div className="flex justify-center gap-3">
            {isAuthenticated ? (
              <Button
                shape="link"
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  shape="link"
                  variant="secondary"
                  size="sm"
                  onClick={() => setOpenModal(ModalType.LOGIN)}
                >
                  Login
                </Button>

                <Separator orientation="vertical" />

                <Button
                  shape="link"
                  variant="primary"
                  size="sm"
                  onClick={() => setOpenModal(ModalType.SIGNUP)}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />
      </header>

      {openModal === ModalType.LOGIN && (
        <LoginModal
          onSubmit={async data => {
            await handleLogin(data)
            setOpenModal(ModalType.NONE)
          }}
        />
      )}

      {openModal === ModalType.SIGNUP && (
        <SignupModal
          onSubmit={async data => {
            await handleSignup(data)
            setOpenModal(ModalType.NONE)
          }}
        />
      )}
    </Modal>
  )
}
