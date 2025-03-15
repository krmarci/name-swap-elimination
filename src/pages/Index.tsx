
import { useNames } from "@/context/NameContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  RefreshCw, 
  Trophy 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBar from "@/components/NavBar";

const Index = () => {
  const { getTopNames, isLoading, fetchNames } = useNames();
  
  const topBoyNames = getTopNames("boy", 100);
  const topGirlNames = getTopNames("girl", 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NameSwap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vote on your favorite names and see how they rank based on the Elo rating system.
            Create or join groups to compare rankings with friends.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/boys">
              <Button size="lg" className="bg-boy hover:bg-boy-dark">
                Vote on Boy Names
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/girls">
              <Button size="lg" className="bg-girl hover:bg-girl-dark">
                Vote on Girl Names
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={fetchNames}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Names
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Boy Names Ranking */}
          <Card className="shadow-lg border-boy border-t-4">
            <CardHeader className="bg-boy-light">
              <CardTitle className="flex items-center text-boy-dark">
                <Trophy className="mr-2 h-5 w-5" />
                Top 100 Boy Names
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh]">
                <div className="p-4">
                  {topBoyNames.map((name, index) => (
                    <div
                      key={name.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <span className="w-8 text-center font-bold text-gray-500">
                          {index + 1}
                        </span>
                        <span className="font-medium">{name.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round(name.elo)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Girl Names Ranking */}
          <Card className="shadow-lg border-girl border-t-4">
            <CardHeader className="bg-girl-light">
              <CardTitle className="flex items-center text-girl-dark">
                <Trophy className="mr-2 h-5 w-5" />
                Top 100 Girl Names
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh]">
                <div className="p-4">
                  {topGirlNames.map((name, index) => (
                    <div
                      key={name.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <span className="w-8 text-center font-bold text-gray-500">
                          {index + 1}
                        </span>
                        <span className="font-medium">{name.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round(name.elo)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
