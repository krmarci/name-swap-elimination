import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

export type Gender = "boy" | "girl";
export type VoteResult = 0 | 1 | 2; // 0 for left name, 1 for right name, 2 for tie

export interface Name {
  id: string;
  name: string;
  gender: Gender;
  elo: number;
}

export interface Vote {
  userId: string;
  timestamp: string;
  name1Id: string;
  name2Id: string;
  result: VoteResult;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
}

// Test data arrays
const boysTestData = ['Gellért', 'Sámuel', 'Aurél', 'Baltazár', 'Benedek', 'Csongor', 'Dávid', 'Dénes', 'Dominik', 'Gergely', 'Hunor', 'Mikó', 'Nándor', 'Roland', 'Szabolcs', 'Tibor', 'Vencel', 'Béla', 'Elek', 'Máté', 'Mihály', 'Miklós', 'Ottó', 'Róbert', 'Ábel', 'Ágost', 'Aladár', 'Alfréd', 'Andor', 'András', 'Antal', 'Ármin', 'Arnold', 'Áron', 'Árpád', 'Artúr', 'Balázs', 'Barnabás', 'Bendegúz', 'Berengár', 'Bernárd', 'Bernát', 'Bertalan', 'Boldizsár', 'Botond', 'Csaba', 'Dániel', 'Dezső', 'Donát', 'Ede', 'Elemér', 'Emett', 'Ernő', 'Félix', 'Ferenc', 'Gábor', 'Géza', 'Gusztáv', 'Huba', 'Hugó', 'Illés', 'Ince', 'István', 'Károly', 'Keresztély', 'Kolos', 'Koppány', 'Lajos', 'László', 'Levente', 'Lóránd', 'Magor', 'Márton', 'Medárd', 'Miksa', 'Norbert', 'Oszkár', 'Örs', 'Patrik', 'Péter', 'Richárd', 'Salamon', 'Sándor', 'Sebestyén', 'Simon', 'Szilárd', 'Teó', 'Tóbiás', 'Vászoly', 'Viktor', 'Vilmos', 'Vince', 'Vitold', 'Zoltán', 'Zsigmond', 'Zsolt', 'Ádám', 'Ambrus', 'Attila', 'Benett'];

const girlsTestData = ['Borbála', 'Lilla', 'Panna', 'Anna', 'Aranka', 'Elvira', 'Erzsébet', 'Eszter', 'Etelka', 'Gréta', 'Hajnalka', 'Ilona', 'Júlia', 'Julianna', 'Karolina', 'Kincső', 'Liána', 'Lívia', 'Márta', 'Piroska', 'Sára', 'Zsófia', 'Zsuzsanna', 'Apollónia', 'Cecília', 'Csenge', 'Dorottya', 'Lídia', 'Linda', 'Patrícia', 'Réka', 'Valéria', 'Zita', 'Adaléna', 'Alícia', 'Alíz', 'Alojzia', 'Amanda', 'Andrea', 'Anett', 'Anita', 'Annaléna', 'Antónia', 'Aurélia', 'Auróra', 'Bea', 'Beáta', 'Bernadett', 'Bettina', 'Bíborka', 'Boglárka', 'Bóra', 'Brigitta', 'Csilla', 'Dóra', 'Dorina', 'Ella', 'Elza', 'Emília', 'Emma', 'Enikő', 'Eugénia', 'Éva', 'Evelin', 'Fabrícia', 'Felícia', 'Gabriella', 'Gertrúd', 'Glória', 'Gyöngyi', 'Gyöngyvér', 'Heléna', 'Helga', 'Hermina', 'Izabell', 'Izabella', 'Janka', 'Jázmin', 'Johanna', 'Jolán', 'Julietta', 'Kamilla', 'Kata', 'Katalin', 'Konstancia', 'Korina', 'Laura', 'Léda', 'Léna', 'Leonóra', 'Letícia', 'Lina', 'Linell', 'Ludovika', 'Lujza', 'Margit', 'Margó', 'Matild', 'Matilda', 'Mia'];

interface NameContextType {
  userId: string;
  boyNames: Name[];
  girlNames: Name[];
  votes: Vote[];
  groups: Group[];
  currentGroup: string | null;
  isLoading: boolean;
  addVote: (name1Id: string, name2Id: string, result: VoteResult, groupId?: string) => void;
  getNamePair: (gender: Gender) => [Name, Name];
  getTopNames: (gender: Gender, limit: number) => Name[];
  getUserRanking: (gender: Gender) => Name[];
  getGroupRanking: (groupId: string, gender: Gender) => Name[];
  createGroup: (name: string) => Group;
  joinGroup: (groupId: string) => boolean;
  setCurrentGroup: (groupId: string | null) => void;
  getGroupById: (groupId: string) => Group | undefined;
  fetchNames: () => Promise<void>;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

const START_ELO = 1200;
const K_FACTOR = 32;

// Calculate new Elo rating
const calculateElo = (ratingA: number, ratingB: number, resultA: number): [number, number] => {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
  
  let scoreA, scoreB;
  
  if (resultA === 0) { // A wins
    scoreA = 1;
    scoreB = 0;
  } else if (resultA === 1) { // B wins
    scoreA = 0;
    scoreB = 1;
  } else { // tie
    scoreA = 0.5;
    scoreB = 0.5;
  }
  
  const newRatingA = ratingA + K_FACTOR * (scoreA - expectedA);
  const newRatingB = ratingB + K_FACTOR * (scoreB - expectedB);
  
  return [newRatingA, newRatingB];
};

export const NameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [userId] = useLocalStorage("nameswap-user-id", uuidv4());
  const [boyNames, setBoyNames] = useState<Name[]>([]);
  const [girlNames, setGirlNames] = useState<Name[]>([]);
  const [votes, setVotes] = useLocalStorage<Vote[]>("nameswap-votes", []);
  const [groups, setGroups] = useLocalStorage<Group[]>("nameswap-groups", []);
  const [currentGroup, setCurrentGroup] = useLocalStorage<string | null>("nameswap-current-group", null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastNamePair, setLastNamePair] = useState<{ gender: Gender, pair: [string, string] | null }>({
    gender: "boy",
    pair: null
  });

  // Load names from our local test data instead of fetching from URLs
  const fetchNames = async () => {
    setIsLoading(true);
    try {
      // Create name objects with initial Elo ratings from the test data
      const formattedBoyNames = boysTestData.map(name => ({
        id: `boy-${name}`,
        name,
        gender: "boy" as Gender,
        elo: START_ELO
      }));
      
      const formattedGirlNames = girlsTestData.map(name => ({
        id: `girl-${name}`,
        name,
        gender: "girl" as Gender,
        elo: START_ELO
      }));
      
      setBoyNames(formattedBoyNames);
      setGirlNames(formattedGirlNames);
      
      // Calculate Elo ratings based on saved votes
      calculateAndApplyEloRatings(formattedBoyNames, formattedGirlNames, votes);
      
      setIsLoading(false);
      toast({
        title: "Names Loaded",
        description: `Loaded ${formattedBoyNames.length} boy names and ${formattedGirlNames.length} girl names.`,
      });
    } catch (error) {
      console.error("Error loading names:", error);
      toast({
        title: "Error",
        description: "Failed to load names. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Calculate and apply Elo ratings based on vote history
  const calculateAndApplyEloRatings = (boyList: Name[], girlList: Name[], voteHistory: Vote[]) => {
    // Create a map for quick lookup
    const nameMap = new Map<string, Name>();
    
    boyList.forEach(name => nameMap.set(name.id, { ...name }));
    girlList.forEach(name => nameMap.set(name.id, { ...name }));
    
    // Sort votes by timestamp
    const sortedVotes = [...voteHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Apply each vote to update Elo ratings
    sortedVotes.forEach(vote => {
      const name1 = nameMap.get(vote.name1Id);
      const name2 = nameMap.get(vote.name2Id);
      
      if (name1 && name2) {
        const [newElo1, newElo2] = calculateElo(name1.elo, name2.elo, vote.result);
        name1.elo = newElo1;
        name2.elo = newElo2;
        
        nameMap.set(name1.id, name1);
        nameMap.set(name2.id, name2);
      }
    });
    
    // Update state with new Elo ratings
    const updatedBoyNames = boyList.map(name => nameMap.get(name.id) || name);
    const updatedGirlNames = girlList.map(name => nameMap.get(name.id) || name);
    
    setBoyNames(updatedBoyNames);
    setGirlNames(updatedGirlNames);
  };

  // Add a new vote
  const addVote = (name1Id: string, name2Id: string, result: VoteResult, groupId?: string) => {
    const newVote: Vote = {
      userId,
      timestamp: new Date().toISOString(),
      name1Id,
      name2Id,
      result,
      groupId,
    };
    
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    
    // Update Elo ratings
    const allNames = [...boyNames, ...girlNames];
    const name1 = allNames.find(n => n.id === name1Id);
    const name2 = allNames.find(n => n.id === name2Id);
    
    if (name1 && name2) {
      const [newElo1, newElo2] = calculateElo(name1.elo, name2.elo, result);
      
      if (name1.gender === "boy") {
        setBoyNames(prev => 
          prev.map(n => n.id === name1.id ? { ...n, elo: newElo1 } : n)
        );
      } else {
        setGirlNames(prev => 
          prev.map(n => n.id === name1.id ? { ...n, elo: newElo1 } : n)
        );
      }
      
      if (name2.gender === "boy") {
        setBoyNames(prev => 
          prev.map(n => n.id === name2.id ? { ...n, elo: newElo2 } : n)
        );
      } else {
        setGirlNames(prev => 
          prev.map(n => n.id === name2.id ? { ...n, elo: newElo2 } : n)
        );
      }
    }
    
    // Reset last name pair
    setLastNamePair({
      gender: name1?.gender || "boy",
      pair: null
    });
  };

  // Get a random pair of names for voting
  const getNamePair = (gender: Gender): [Name, Name] => {
    const names = gender === "boy" ? boyNames : girlNames;
    if (names.length < 2) {
      throw new Error(`Not enough ${gender} names to create a pair`);
    }
    
    // Try not to repeat the last pair
    let index1, index2;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      index1 = Math.floor(Math.random() * names.length);
      do {
        index2 = Math.floor(Math.random() * names.length);
      } while (index1 === index2);
      
      attempts++;
    } while (
      lastNamePair.gender === gender &&
      lastNamePair.pair !== null &&
      lastNamePair.pair[0] === names[index1].id &&
      lastNamePair.pair[1] === names[index2].id &&
      attempts < maxAttempts
    );
    
    // Save this pair to avoid immediate repetition
    setLastNamePair({
      gender,
      pair: [names[index1].id, names[index2].id]
    });
    
    return [names[index1], names[index2]];
  };

  // Get top names by Elo rating
  const getTopNames = (gender: Gender, limit: number) => {
    const names = gender === "boy" ? boyNames : girlNames;
    return [...names]
      .sort((a, b) => b.elo - a.elo)
      .slice(0, limit);
  };

  // Get user rankings based on their votes
  const getUserRanking = (gender: Gender) => {
    const names = gender === "boy" ? boyNames : girlNames;
    const userVotes = votes.filter(v => v.userId === userId && !v.groupId);
    
    if (userVotes.length === 0) {
      return getTopNames(gender, 100); // Return global ranking if no votes
    }
    
    // Create a copy of names to calculate user-specific Elo
    const userNames = names.map(n => ({ ...n, elo: START_ELO }));
    const nameMap = new Map<string, Name>();
    userNames.forEach(name => nameMap.set(name.id, name));
    
    // Sort votes by timestamp
    const sortedVotes = [...userVotes].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Apply each vote to update Elo ratings
    sortedVotes.forEach(vote => {
      const name1 = nameMap.get(vote.name1Id);
      const name2 = nameMap.get(vote.name2Id);
      
      if (name1 && name2) {
        const [newElo1, newElo2] = calculateElo(name1.elo, name2.elo, vote.result);
        name1.elo = newElo1;
        name2.elo = newElo2;
        
        nameMap.set(name1.id, name1);
        nameMap.set(name2.id, name2);
      }
    });
    
    // Convert map back to array and sort
    const rankedNames = Array.from(nameMap.values())
      .filter(n => n.gender === gender)
      .sort((a, b) => b.elo - a.elo);
    
    return rankedNames;
  };

  // Get group-specific rankings
  const getGroupRanking = (groupId: string, gender: Gender) => {
    const names = gender === "boy" ? boyNames : girlNames;
    const groupVotes = votes.filter(v => v.groupId === groupId);
    
    if (groupVotes.length === 0) {
      return getTopNames(gender, 100); // Return global ranking if no votes
    }
    
    // Create a copy of names to calculate group-specific Elo
    const groupNames = names.map(n => ({ ...n, elo: START_ELO }));
    const nameMap = new Map<string, Name>();
    groupNames.forEach(name => nameMap.set(name.id, name));
    
    // Sort votes by timestamp
    const sortedVotes = [...groupVotes].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Apply each vote to update Elo ratings
    sortedVotes.forEach(vote => {
      const name1 = nameMap.get(vote.name1Id);
      const name2 = nameMap.get(vote.name2Id);
      
      if (name1 && name2) {
        const [newElo1, newElo2] = calculateElo(name1.elo, name2.elo, vote.result);
        name1.elo = newElo1;
        name2.elo = newElo2;
        
        nameMap.set(name1.id, name1);
        nameMap.set(name2.id, name2);
      }
    });
    
    // Convert map back to array and sort
    const rankedNames = Array.from(nameMap.values())
      .filter(n => n.gender === gender)
      .sort((a, b) => b.elo - a.elo);
    
    return rankedNames;
  };

  // Create a new group
  const createGroup = (name: string) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      createdBy: userId,
      members: [userId]
    };
    
    setGroups([...groups, newGroup]);
    toast({
      title: "Group Created",
      description: `${name} has been created successfully.`,
    });
    
    return newGroup;
  };

  // Join an existing group
  const joinGroup = (groupId: string) => {
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      toast({
        title: "Error",
        description: "Group not found.",
        variant: "destructive",
      });
      return false;
    }
    
    const group = groups[groupIndex];
    
    if (group.members.includes(userId)) {
      toast({
        title: "Already a Member",
        description: "You are already a member of this group.",
      });
      return false;
    }
    
    const updatedGroup = {
      ...group,
      members: [...group.members, userId]
    };
    
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = updatedGroup;
    
    setGroups(updatedGroups);
    toast({
      title: "Joined Group",
      description: `You have joined ${group.name} successfully.`,
    });
    
    return true;
  };

  // Get a group by ID
  const getGroupById = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };

  // Load names on initial render
  useEffect(() => {
    fetchNames();
  }, []);

  const value = {
    userId,
    boyNames,
    girlNames,
    votes,
    groups,
    currentGroup,
    isLoading,
    addVote,
    getNamePair,
    getTopNames,
    getUserRanking,
    getGroupRanking,
    createGroup,
    joinGroup,
    setCurrentGroup,
    getGroupById,
    fetchNames
  };

  return (
    <NameContext.Provider value={value}>
      {children}
    </NameContext.Provider>
  );
};

export const useNames = () => {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error("useNames must be used within a NameProvider");
  }
  return context;
};
