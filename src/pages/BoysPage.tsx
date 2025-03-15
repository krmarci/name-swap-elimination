
import { useState, useEffect } from "react";
import { useNames, Name, VoteResult } from "@/context/NameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import { Equals } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BoysPage = () => {
  const { getNamePair, addVote, currentGroup } = useNames();
  const { toast } = useToast();
  const [namePair, setNamePair] = useState<[Name, Name] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    if (!namePair) {
      try {
        setNamePair(getNamePair("boy"));
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not get name pair. Please try again later.",
          variant: "destructive",
        });
      }
    }
  }, [namePair, getNamePair]);

  const handleVote = (result: VoteResult) => {
    if (!namePair || isProcessing) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      if (namePair) {
        addVote(namePair[0].id, namePair[1].id, result, currentGroup || undefined);
        setVoteCount(prev => prev + 1);
        setNamePair(null);
        setIsProcessing(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-boy mb-4">Vote on Boy Names</h1>
          <p className="text-xl text-gray-600">
            Click on the name you prefer, or the equals sign if you can't decide.
            {currentGroup && <span className="font-medium"> Voting in group mode.</span>}
          </p>
          
          <div className="text-sm text-gray-500 mt-2">
            Votes cast: {voteCount}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">
          {namePair ? (
            <>
              <Button
                onClick={() => handleVote(0)}
                disabled={isProcessing}
                className="bg-boy hover:bg-boy-dark text-white w-full md:w-5/12 h-32 md:h-64 text-2xl md:text-4xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                {namePair[0].name}
              </Button>
              
              <Button
                onClick={() => handleVote(2)}
                disabled={isProcessing}
                variant="outline"
                className="w-full md:w-2/12 h-16 md:h-20 rounded-xl mx-2 border-2"
              >
                <Equals className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={() => handleVote(1)}
                disabled={isProcessing}
                className="bg-boy hover:bg-boy-dark text-white w-full md:w-5/12 h-32 md:h-64 text-2xl md:text-4xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                {namePair[1].name}
              </Button>
            </>
          ) : (
            <Card className="w-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="text-gray-400">Loading names...</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 max-w-2xl mx-auto">
            Your votes help determine which names are most popular. All votes are stored
            locally on your device. Click the equals sign if you think both names are equally good.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoysPage;
