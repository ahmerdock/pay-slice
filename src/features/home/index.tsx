import { PAGE_TITLES } from "@/constants/routes";
import { TabsLayout } from "@/layouts";

export default function Home() {
  return (
    <TabsLayout titleProps={{ title: PAGE_TITLES.HOME }}>{null}</TabsLayout>
  );
}
