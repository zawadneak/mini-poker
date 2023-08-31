import { AlertDialog, Button, XStack, YStack } from "tamagui";

export function ConfirmGameExit({ onConfirm, onCancel }) {
  return (
    <AlertDialog open>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          maxWidth={300}
        >
          <YStack space>
            <AlertDialog.Title>♦️ Leave table?</AlertDialog.Title>

            <AlertDialog.Description>
              If you leave the table, you may lose game progress. Are you sure
              you want to leave?
            </AlertDialog.Description>
            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild onPress={onCancel}>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild onPress={onConfirm}>
                <Button theme="active" bg="$red10">
                  Leave
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
