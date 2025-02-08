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
  input: z.number().min(0.01, { message: "Amount should be greater than 0" }),
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
      input: 0,
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
          title: 'Some thing went wrong',
          variant: 'destructive'
        })
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
        (input * currencies[outputIndex].price) / currencies[inputIndex].price
      );
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center px-8 md:px-12 lg:px-24 py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:grid md:grid-cols-3 gap-4 w-full px-8 md:px-12 lg:px-24 py-10 border-2 rounded-3xl border-black"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount to send</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedValue = value ? parseFloat(value) : 0;
                      field.onChange(parsedValue);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Please enter the amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inputCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Currency</FormLabel>
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
                <FormLabel>Output Currency</FormLabel>
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
          <Button type="submit" className="mt-4 w-full">SWAP</Button>
          <div className="col-span-2 mt-4">
            Result: {result}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default App;
