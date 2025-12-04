import { N8NFindedCredential } from "@/lib/workflowManager";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function AddMissingCredentialsDialog(props: {
  open: boolean;
  setOpen: (state: boolean) => void;
  credentials: N8NFindedCredential[] | undefined;
}) {
  const { credentials, open, setOpen } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Add Missing environment credentials</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Credential</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials?.map((credential, index) => (
              <TableRow key={index}>
                <TableCell>{credential.id}</TableCell>
                <TableCell>{credential.name}</TableCell>
                <TableCell>ENV</TableCell>
                <TableCell>CREDENTIAL</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
