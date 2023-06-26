import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import SunCalc from "suncalc";

export default function Home() {
  const altitude = useSignal(
    SunCalc.getPosition(new Date(), 35.6762, 139.6503).altitude,
  );
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6 btn btn-primary">
          {altitude}
        </p>
      </div>
    </>
  );
}
