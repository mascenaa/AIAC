
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutUs() {
     const teamMembers = [
          { name: "João Mascena", role: "Fullstack Backend", image: "https://media.licdn.com/dms/image/v2/D4D03AQHkXgJwj0S4Tg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725022915815?e=1735171200&v=beta&t=m3WMk21ci2rvarIKiATQkuJz0ZrL_ykE7ehKXVGKvQc" },
          { name: "Giovanna Souza", role: "Product Manager", image: "https://media.licdn.com/dms/image/v2/D4D03AQHMx-9zNt6AzA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1676899345916?e=1735171200&v=beta&t=XjwgUFTK32cM1z70rRDdq5Bb3t33jKM29ZrJCbrB51A" },
          { name: "Felipe Murakami", role: "Testing & Assembly", image: "https://media.licdn.com/dms/image/v2/D4D03AQEzIxTgZSi5pQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1690988196288?e=1735171200&v=beta&t=BGMkK8q35OhbWWEu9RvSPAueeBDEfYJ-twMG7pR41Nw" },
          { name: "Eshley Maria", role: "3D Designer", image: "https://media.licdn.com/dms/image/v2/D4D03AQHhYi_9sKJ8EA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1690990231679?e=1735171200&v=beta&t=Re09W8kJ2n8prFcQrmu8EQje-8is1HnVwelw7DuUhOM" },
          { name: "Felipe Lira", role: "Testing & Assembly", image: "https://media.licdn.com/dms/image/v2/D4D03AQGVQ95eWpjD3A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1715900671735?e=1735171200&v=beta&t=TLTL8lcSjd6ZdJJZzNvHjyfzVEZA7oE3o66hHUeNXtk" },
          { name: "Pietro Garbin", role: "Testing & Assembly", image: "https://media.licdn.com/dms/image/v2/D4D35AQG9n0O7Ayl0uQ/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1714414782251?e=1730368800&v=beta&t=giNMthGsAklYehRFUEDf5BYeBEqm44WuT0FJzy7MjHM" },
     ]

     return (
          <div className="container mx-auto px-4 py-8">
               <section className="mb-16">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                         <div className="space-y-4">
                              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Sobre nosso projeto</h1>
                              <p className="text-gray-500 dark:text-gray-400 max-w-[600px]">
                                   Ao ser apresntados ao desafio de criar um projeto usando o NodeMCU, decidimos criar um projeto que pudesse ajudar a comunidade de alguma forma. Assim, surgiu a ideia de criar um projeto que pudesse ajudar a comunidades de alguma forma.
                                   Assim, surgiu a ideia do <strong>AIAC (Artificial Intelligence Arduino Car)</strong>, um carrinho autônomo que pode ser controlado a distância, e que possui um sistema interno de decisão aplicada.
                              </p>
                         </div>
                         <div className="lg:order-first">
                              <Image
                                   src="/placeholder.svg?height=400&width=600"
                                   alt="Project illustration"
                                   width={600}
                                   height={400}
                                   className="rounded-lg object-cover"
                              />
                         </div>
                    </div>
               </section>

               <section>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8">Nossa equipe</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                         {teamMembers.map((member, index) => (
                              <Card key={index}>
                                   <CardContent className="p-4 flex flex-col items-center text-center">
                                        <Image
                                             src={member.image}
                                             alt={member.name}
                                             width={100}
                                             height={100}
                                             className="rounded-full mb-4"
                                        />
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               </section>
          </div>
     )
}