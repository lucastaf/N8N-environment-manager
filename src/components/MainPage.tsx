import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import WorkflowsTab from "./pages/Workflows";
import EnviromentsTab from "./pages/Enviroments";

export default function MainPage() {
  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="enviroments">Enviroments</TabsTrigger>
        </TabsList>
        <TabsContent value="workflows">
          <WorkflowsTab />
        </TabsContent>
        <TabsContent value="enviroments">
          <EnviromentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
