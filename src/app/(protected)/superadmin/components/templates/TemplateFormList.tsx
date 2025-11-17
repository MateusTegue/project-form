import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";

export function FormTemplateList({ templates, onSelect, companyName }: any) {
  if (!templates.length)
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No hay formularios disponibles
        </CardContent>
      </Card>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template: any) => {
        const moduleCount = template.moduleAssignments?.length || 0;
        const totalFields =
          template.moduleAssignments?.reduce(
            (acc: number, a: any) => acc + (a.module?.fields?.length || 0),
            0
          ) || 0;

        return (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-6 w-6 text-primary" />
                <Badge variant="outline">{template.templateType}</Badge>
              </div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {template.description || "Sin descripción"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                {moduleCount} módulo(s) • {totalFields} campo(s)
              </p>
              <Button size="sm" className="w-full" onClick={() => onSelect(template)}>
                <Send className="mr-2 h-4 w-4" /> Asignar a {companyName}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
