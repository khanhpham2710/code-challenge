import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "./hooks/use-toast";

const currenciesEnums = [
  "BLUR",
  "bNEO",
  "BUSD",
  "USD",
  "ETH",
  "GMX",
  "STEVMOS",
  "LUNA",
  "RATOM",
  "STRD",
  "EVMOS",
  "IBCX",
  "IRIS",
  "ampLUNA",
  "KUJI",
  "STOSMO",
  "USDC",
  "axlUSDC",
  "ATOM",
  "STATOM",
  "OSMO",
  "rSWTH",
  "STLUNA",
  "LSI",
  "OKB",
  "OKT",
  "SWTH",
  "USC",
  "WBTC",
  "wstETH",
  "YieldUSD",
  "ZIL",
] as const;

const formSchema = z.object({
  input: z.string().refine((value) => /^[0-9]*\.?[0-9]+$/.test(value), {
    message: "Invalid decimal number",
  }),
  inputCurrency: z.enum(currenciesEnums),
  outputCurrency: z.enum(currenciesEnums),
});

interface Currency {
  currency: string;
  date: string;
  price: number;
}

function App() {
  const [result, setResult] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<Currency[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
      inputCurrency: "USC",
      outputCurrency: "USDC",
    },
  });

  useEffect(() => {
    async function getData() {
      const url = "https://interview.switcheo.com/prices.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Some thing went wrong",
          variant: "destructive",
        });
      }
    }

    getData();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (currencies) {
      const { input, inputCurrency, outputCurrency } = values;

      const inputIndex = currencies.findIndex(
        (item) => item.currency == inputCurrency
      );
      const outputIndex = currencies.findIndex(
        (item) => item.currency == outputCurrency
      );

      setResult(
        (parseFloat(input) * currencies[outputIndex].price) /
          currencies[inputIndex].price
      );
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center px-8 md:px-12 lg:px-24 py-10 min-h-screen bg-blue-100">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-lg border-2 border-black">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Expense Tracker
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:grid md:grid-cols-2 gap-4 w-full px-2"
          >
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-md font-semibold text-blue-600">
                    Amount to send
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9.]/g, "");

                        const dotCount = (value.match(/\./g) || []).length;
                        if (dotCount > 1) {
                          value =
                            value.slice(0, value.indexOf(".") + 1) +
                            value
                              .slice(value.indexOf(".") + 1)
                              .replace(/\./g, "");
                        }

                        field.onChange(value);
                      }}
                      className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value}
                      placeholder="Please enter the amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold text-blue-600">
                    Input Currency
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select input currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currenciesEnums.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the currency you are sending
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outputCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold text-blue-600">
                    Output Currency
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select output currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currenciesEnums.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the currency to receive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 w-full col-span-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              SWAP
            </Button>
            <div className="col-span-2 mt-2 text-2xl font-semibold text-blue-800">
              Result: {result}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default App;
