"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { use, useEffect, useRef } from "react"
import ReactPlayer from 'react-player'
import { Switch } from "@/components/ui/switch";
import Spline from "@splinetool/react-spline";

export default function Home() {
  const component = useRef<any>();
  const temperature = 100;

  function onLoad(spline: any) {
    const obj = spline.findObjectById('814477c4-88ce-42d7-ab6a-425210cfbfb9');

    component.current = obj;
  }


  useEffect(() => {
    console.log(component.current);

    if (temperature > 30) {
      if (component.current) {
        component.current.page = "Scene 2";
      }
    }
  });

  return (
    <main className=" bg-white">
      <div className="grid grid-cols-1  md:grid-cols-[300px_1fr] gap-6">
        <Card className="bg-background p-6 shadow-lg">
          <CardHeader>
            <CardTitle>AIAC Control</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Car Status</div>
              <div className="flex items-center gap-2">
                <ul>
                  <li className="flex  items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span>Bateria</span>
                  </li>
                  <li className="flex  items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span>Camera</span>
                  </li>
                  <li className="flex  items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span>AIAC</span>
                  </li>
                  <li className="mt-2">
                    Condução: <span className="font-bold">Manual</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Temperatura</div>
              <div className="flex items-center gap-2">
                <span>25°C</span>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Opções</div>
              <div className="flex items-center gap-2">
                <Checkbox id="alert-motion" />
                <Label htmlFor="alert-motion">
                  ?
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="alert-sound" />
                <Label htmlFor="alert-sound">
                  ?
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Ações</div>
              <div className="flex items-center gap-2">
                <Switch id="turn" />
                <Label>
                  Ligar
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-background p-6 shadow-lg">
            <CardHeader>
              <CardTitle>Camera 1</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactPlayer src="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
            </CardContent>
          </Card>
          <Card className="bg-background p-6 shadow-lg">
            <CardHeader>
              <CardTitle>Frame</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="h-[35rem]">
                <Spline
                  scene="https://draft.spline.design/vwAEu9to6ypVUq6q/scene.splinecode"
                  onLoad={onLoad}
                />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="bg-background p-6 shadow-lg w-full">
        <CardHeader>
          <CardTitle>Camera Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-04-15</TableCell>
                <TableCell>10:30 AM</TableCell>
                <TableCell>Main Entrance</TableCell>
                <TableCell>
                  <Badge variant="outline">Online</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-04-14</TableCell>
                <TableCell>3:45 PM</TableCell>
                <TableCell>Lobby</TableCell>
                <TableCell>
                  <Badge variant="outline">Offline</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-04-13</TableCell>
                <TableCell>8:20 AM</TableCell>
                <TableCell>Parking Lot</TableCell>
                <TableCell>
                  <Badge variant="outline">Online</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-04-12</TableCell>
                <TableCell>11:55 PM</TableCell>
                <TableCell>Rear Entrance</TableCell>
                <TableCell>
                  <Badge variant="outline">Online</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-04-11</TableCell>
                <TableCell>6:05 PM</TableCell>
                <TableCell>Lobby</TableCell>
                <TableCell>
                  <Badge variant="outline">Offline</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

