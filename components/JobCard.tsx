import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function JobCard() {
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Frontend Engineer</CardTitle>
        <CardDescription>Google</CardDescription>
        <CardContent>Information goes here</CardContent>
      </CardHeader>
    </Card>
  );
}
