import { Dispatch, useState, useEffect } from "react";
import { Label } from "./ui/label";
import ClearableInput from "./clearable-input";
import { Button } from "./ui/button";
import { TShortUrl } from "@/lib/types";
import { shortenUrl, validateUrl } from "@/lib/utils";
const defaultVal = "https://ui.shadcn.com/docs/components/carousel";
async function getCurrentTabUrl() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0]?.url ?? defaultVal;
}

export default function UrlHandler({
  setShortUrl,
}: {
  setShortUrl: Dispatch<React.SetStateAction<TShortUrl>>;
}) {
  const [longUrl, setLongUrl] = useState(defaultVal);
  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getCurrentTabUrl(); // Fetch the current tab URL
      setLongUrl(url);
    };

    fetchUrl();
  }, []);
  const handleShortUrl = async (longUrl: string) => {
    try {
      const res = validateUrl(longUrl);
      const shortUrlString = await shortenUrl(res);
      setShortUrl({ text: shortUrlString, success: true });
    } catch (err: any) {
      setShortUrl({ text: err.message as string, success: false });
    }
  };
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="name">Long URL</Label>
      <ClearableInput inputVal={longUrl} setInputVal={setLongUrl} />
      <Button
        className="w-full font-bold"
        variant="custom"
        onClick={() => handleShortUrl(longUrl)}
      >
        Generate Short URL
      </Button>
    </div>
  );
}
