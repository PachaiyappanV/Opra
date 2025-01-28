import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};
const Modal = ({ trigger, children, title, description, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
