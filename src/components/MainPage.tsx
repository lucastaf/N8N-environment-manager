import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import WorkflowsTab from "./pages/Workflows";
import EnviromentsTab from "./pages/Enviroments";
import CredentialsTab from "./pages/Credentials";

export default function MainPage() {
  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="enviroments">Enviroments</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>
        <TabsContent value="workflows">
          <WorkflowsTab />
        </TabsContent>
        <TabsContent value="enviroments">
          <EnviromentsTab />
        </TabsContent>
        <TabsContent value="credentials">
          <CredentialsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
