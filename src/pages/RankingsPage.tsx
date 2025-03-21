
import { useState, useEffect } from "react";
import { useNames } from "@/context/NameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { Trophy, UserRound, Globe, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const RankingsPage = () => {
  const { getUserRanking, getTopNames, votes, userId } = useNames();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("boys");
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // If not logged in, show a login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-xl text-gray-600 mb-8">
              You need to be logged in to view your rankings.
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate("/")}>
              <LogIn className="h-5 w-5" />
              Go to Homepage to Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const userBoyRankings = getUserRanking("boy");
  const userGirlRankings = getUserRanking("girl");
  const globalBoyRankings = getTopNames("boy", 100);
  const globalGirlRankings = getTopNames("girl", 100);
  
  const userVotesCount = votes.filter(v => v.userId === userId && !v.groupId).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Rankings</h1>
          <p className="text-xl text-gray-600">
            Your personal name rankings based on {userVotesCount} votes.
          </p>
        </div>
        
        <Tabs defaultValue="boys" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="boys" className="text-boy">
                Boy Names
              </TabsTrigger>
              <TabsTrigger value="girls" className="text-girl">
                Girl Names
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="boys">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Boy Rankings */}
              <Card className="shadow-lg border-boy border-t-4">
                <CardHeader className="bg-boy-light">
                  <CardTitle className="flex items-center text-boy-dark">
                    <UserRound className="mr-2 h-5 w-5" />
                    My Boy Name Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="p-4">
                      {userBoyRankings.length > 0 ? (
                        userBoyRankings.map((name, index) => (
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
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                          <p>No votes yet</p>
                          <p className="text-sm">Vote on names to build your rankings</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Global Boy Rankings */}
              <Card className="shadow-lg border-boy border-t-4">
                <CardHeader className="bg-boy-light">
                  <CardTitle className="flex items-center text-boy-dark">
                    <Globe className="mr-2 h-5 w-5" />
                    Global Boy Name Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="p-4">
                      {globalBoyRankings.map((name, index) => (
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
          </TabsContent>
          
          <TabsContent value="girls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Girl Rankings */}
              <Card className="shadow-lg border-girl border-t-4">
                <CardHeader className="bg-girl-light">
                  <CardTitle className="flex items-center text-girl-dark">
                    <UserRound className="mr-2 h-5 w-5" />
                    My Girl Name Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="p-4">
                      {userGirlRankings.length > 0 ? (
                        userGirlRankings.map((name, index) => (
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
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                          <p>No votes yet</p>
                          <p className="text-sm">Vote on names to build your rankings</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Global Girl Rankings */}
              <Card className="shadow-lg border-girl border-t-4">
                <CardHeader className="bg-girl-light">
                  <CardTitle className="flex items-center text-girl-dark">
                    <Globe className="mr-2 h-5 w-5" />
                    Global Girl Name Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="p-4">
                      {globalGirlRankings.map((name, index) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RankingsPage;
