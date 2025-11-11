import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

export default function LoadingButton({
  isLoading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
}) {
  return (
    <Button
      {...props}
      className={`${props.className || ''}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      )}
      {children}
    </Button>
  );
};;;
