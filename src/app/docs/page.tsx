"use client";

import { motion } from "framer-motion";
import {
  ArrowUpDown,
  BookOpen,
  Calculator,
  ChevronRight,
  Code2,
  Database,
  Filter,
  Layers,
  Link2,
  Search,
  Table2,
} from "lucide-react";
import { useState } from "react";
import { SchemaViewer } from "@/components/docs/schema-viewer";
import { SqlReference } from "@/components/docs/sql-reference";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

const sections = [
  { id: "intro", label: "Introducción", icon: BookOpen },
  { id: "schema", label: "Esquema de Datos", icon: Database },
  { id: "commands", label: "Comandos SQL", icon: Code2 },
];

const quickLinks = [
  { label: "SELECT", href: "#select", icon: Table2 },
  { label: "WHERE", href: "#where", icon: Filter },
  { label: "ORDER BY", href: "#orderby", icon: ArrowUpDown },
  { label: "JOIN", href: "#join", icon: Link2 },
  { label: "Agregaciones", href: "#aggregations", icon: Calculator },
  { label: "GROUP BY", href: "#groupby", icon: Layers },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                  {activeSection === section.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-3">
              ACCESO RÁPIDO
            </h4>
            <div className="flex flex-wrap gap-2 px-3">
              {quickLinks.map((link) => (
                <Badge
                  key={link.label}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    setActiveSection("commands");
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {link.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === "intro" && <IntroSection />}
          {activeSection === "schema" && <SchemaViewer />}
          {activeSection === "commands" && (
            <SqlReference searchQuery={searchQuery} />
          )}
        </motion.div>
      </main>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Documentación SQL4All
        </h1>
        <p className="text-lg text-muted-foreground mb-3">
          Guía completa para aprender SQL de forma interactiva. Desde conceptos
          básicos hasta consultas avanzadas.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>
            Basado en <strong className="text-foreground">PostgreSQL</strong> -
            Aprende SQL con la sintaxis y características de PostgreSQL
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>¿Qué es SQL?</CardTitle>
          <CardDescription>
            Structured Query Language - El lenguaje estándar para bases de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            SQL (Structured Query Language) es el lenguaje estándar para
            manipular y consultar bases de datos relacionales. En SQL4All
            aprenderás SQL usando{" "}
            <strong className="text-foreground">PostgreSQL</strong>, uno de los
            sistemas de bases de datos más populares y potentes. Te permite:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Consultar datos de una o más tablas</li>
            <li>Filtrar y ordenar resultados</li>
            <li>Combinar información de diferentes tablas</li>
            <li>Realizar cálculos y agregaciones</li>
            <li>Insertar, actualizar y eliminar datos</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cómo usar SQL4All</CardTitle>
          <CardDescription>
            Aprende practicando con ejercicios interactivos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="start" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="start">Comenzar</TabsTrigger>
              <TabsTrigger value="practice">Practicar</TabsTrigger>
              <TabsTrigger value="progress">Progreso</TabsTrigger>
            </TabsList>
            <TabsContent value="start" className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                1. Selecciona un ejercicio de la lista principal
              </p>
              <p className="text-muted-foreground">
                2. Lee la descripción y los detalles del ejercicio
              </p>
              <p className="text-muted-foreground">
                3. Escribe tu consulta SQL en el editor
              </p>
              <p className="text-muted-foreground">
                4. Presiona{" "}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>{" "}
                para ejecutar
              </p>
            </TabsContent>
            <TabsContent value="practice" className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                Los ejercicios están organizados por dificultad:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600"
                >
                  🌱 Principiante
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-500/10 text-yellow-600"
                >
                  🚀 Intermedio
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-600">
                  ⚡ Avanzado
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Usa las pistas si necesitas ayuda. Tu progreso se guarda
                automáticamente al completar cada ejercicio.
              </p>
            </TabsContent>
            <TabsContent value="progress" className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                Mantén tu racha completando ejercicios cada día. Gana puntos por
                cada ejercicio completado y sube de nivel.
              </p>
              <p className="text-muted-foreground">
                Visita tu perfil para ver estadísticas detalladas y tu historial
                de ejercicios completados.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atajos de Teclado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Ejecutar consulta</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-background rounded text-xs border">
                  Ctrl
                </kbd>
                <span className="text-muted-foreground">+</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs border">
                  Enter
                </kbd>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Formatear SQL</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-background rounded text-xs border">
                  Ctrl
                </kbd>
                <span className="text-muted-foreground">+</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs border">
                  Shift
                </kbd>
                <span className="text-muted-foreground">+</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs border">
                  F
                </kbd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
