import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
// import { stripe } from "@/lib/stripe";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    // const prices = await stripe.prices.list({
    //     product: process.env.NEXT_PLURA_PRODUCT_ID,
    //     active: true,
    // });

    return (
        <>
            <section className="relative mt-[-70px] flex h-full w-full flex-col items-center justify-center md:pt-44 ">
                {/* grid */}

                <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                <p className="text-center">Run your agency, in one place</p>
                <div className="relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                    <h1 className="text-center text-9xl font-bold md:text-[300px]">
                        Plura
                    </h1>
                </div>
                <div className="relative flex items-center justify-center md:mt-[-70px]">
                    <Image
                        src={"/assets/preview.png"}
                        alt="banner image"
                        height={1200}
                        width={1200}
                        className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
                    />
                    <div className="absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background"></div>
                </div>
            </section>
            <section className="mt-[-60px] flex flex-col items-center justify-center gap-4 md:!mt-20">
                <h2 className="text-center text-4xl">
                    {" "}
                    Choose what fits you right
                </h2>
                <p className="text-center text-muted-foreground">
                    Our straightforward pricing plans are tailored to meet your
                    needs. If
                    {" you're"} not <br />
                    ready to commit you can get started for free.
                </p>
                <div className="mt-6  flex flex-wrap justify-center gap-4">
                    {/* {prices.data.map((card) => (
                        //WIP: Wire up free product from stripe
                        <Card
                            key={card.nickname}
                            className={clsx(
                                "flex w-[300px] flex-col justify-between",
                                {
                                    "border-2 border-primary":
                                        card.nickname === "Unlimited Saas",
                                },
                            )}
                        >
                            <CardHeader>
                                <CardTitle
                                    className={clsx("", {
                                        "text-muted-foreground":
                                            card.nickname !== "Unlimited Saas",
                                    })}
                                >
                                    {card.nickname}
                                </CardTitle>
                                <CardDescription>
                                    {
                                        pricingCards.find(
                                            (c) => c.title === card.nickname,
                                        )?.description
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-4xl font-bold">
                                    {card.unit_amount && card.unit_amount / 100}
                                </span>
                                <span className="text-muted-foreground">
                                    <span>/ {card.recurring?.interval}</span>
                                </span>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4">
                                <div>
                                    {pricingCards
                                        .find((c) => c.title === card.nickname)
                                        ?.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex gap-2"
                                            >
                                                <Check />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                </div>
                                <Link
                                    href={`/agency?plan=${card.id}`}
                                    className={clsx(
                                        "w-full rounded-md bg-primary p-2 text-center",
                                        {
                                            "!bg-muted-foreground":
                                                card.nickname !==
                                                "Unlimited Saas",
                                        },
                                    )}
                                >
                                    Get Started
                                </Link>
                            </CardFooter>
                        </Card>
                    ))} */}
                    <Card
                        className={clsx(
                            "flex w-[300px] flex-col justify-between",
                        )}
                    >
                        <CardHeader>
                            <CardTitle
                                className={clsx({
                                    "text-muted-foreground": true,
                                })}
                            >
                                {pricingCards[0].title}
                            </CardTitle>
                            <CardDescription>
                                {pricingCards[0].description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span className="text-4xl font-bold">$0</span>
                            <span>/ month</span>
                        </CardContent>
                        <CardFooter className="flex flex-col  items-start gap-4 ">
                            <div>
                                {pricingCards
                                    .find((c) => c.title === "Starter")
                                    ?.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex gap-2"
                                        >
                                            <Check />
                                            <p>{feature}</p>
                                        </div>
                                    ))}
                            </div>
                            <Link
                                href="/agency"
                                className={clsx(
                                    "w-full rounded-md bg-primary p-2 text-center",
                                    {
                                        "!bg-muted-foreground": true,
                                    },
                                )}
                            >
                                Get Started
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </>
    );
}
