import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import WorkflowsTab from "./pages/Workflows";

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
        <TabsContent value="enviroments">Enviroments</TabsContent>
      </Tabs>
    </div>
  );
}
