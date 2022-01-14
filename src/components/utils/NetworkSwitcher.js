import { useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'

const NetworkSwitcher = ({ onSubmit }) => {
  const [isOpen, setOpen] = useState(false)
  const onClose = () => setOpen(false)
  const submit = () => {
    onClose()
    onSubmit()
  }
  const cancelRef = useRef()

  return (
    <>
      <Button colorScheme='red' onClick={() => setOpen(true)}>
        Switch network
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Switch to Ethereum Rinkeby network
            </AlertDialogHeader>

            <AlertDialogBody>
              You are connected to an unsupported network, please switch to
              Ethereum Rinkeby
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={submit} ml={3}>
                Switch
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default NetworkSwitcher
