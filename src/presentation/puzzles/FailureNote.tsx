export const FailureNote = ({ show, text }: { readonly show: boolean; readonly text: string }) =>
  show ? (
    <p role="alert" className="mt-3 text-sm text-wine-500" data-testid="puzzle-failed">
      {text}
    </p>
  ) : null
