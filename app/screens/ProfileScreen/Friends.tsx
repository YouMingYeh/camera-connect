import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase, get_userid } from "../../utils/supabase"
interface User {
	id: string;
	username: string;
	avatar_url: string;
	email: string;
	}
const Friends = () => {
	const [expanded, setExpanded] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);


	const handlePress = () => {
	setExpanded(!expanded);
	};

	const handleSearch = async () => {
	console.log('Searching for:', searchQuery);
	try {
		const { data, error } = await supabase
		.from('user')
		.select('id, username, avatar_url, email')
		.or(`email.eq.${searchQuery},username.ilike.%${searchQuery}%`);	
	
		if (error) {
		console.error('Search error:', error.message);
		return;
		}
		console.log('Search results:', data);
		setSearchResults(data);
	} catch (err) {
		console.error('An error occurred:', err);
	}
	};
	
	const addFriend = async (receiverId: string) => {
		const userId = await get_userid(); 

		if (!userId) {
		console.error('User ID not found');
		return;
		}
		
		try {
		const { data, error } = await supabase
			.from('friends_with')
			.insert([
			{ sender_id: userId, receiver_id: receiverId }
			]);

		if (error) {
			console.error('Error adding friend:', error.message);
		} 
		} catch (err) {
		console.error('An error occurred:', err);
		}
	};

	const renderItem = ({ item }: { item: User }) => (
		<View style={styles.userRow}>
		  <Image source={{ uri: item.avatar_url || "default_avatar_placeholder.png" }} style={styles.avatar} />
		  <Text style={styles.username}>{item.username}</Text>
		  <Pressable style={styles.addButton} onPress={() => addFriend(item.id)}>
			<Text style={styles.addButtonText}>Add Friend</Text>
		  </Pressable>
		</View>
	  );
	  
	return (
	<View>
	<Pressable style={styles.expandButton} onPress={handlePress}>
		<Text style={styles.expandButtonText}>Search Friends</Text>
		<Feather
		style={styles.expandButtonIcon}
		name={expanded ? "chevron-up" : "chevron-down"}
		size={24}
		color="white"
		/>
	</Pressable>
	{expanded && (
		<View style={styles.container}>
		<TextInput
			style={styles.input}
			onChangeText={setSearchQuery}
			value={searchQuery}
			placeholder="Enter email or name"
			placeholderTextColor="#666"
		/>
		<Pressable style={styles.button} onPress={handleSearch}>
			<Text style={styles.buttonText}>Search</Text>
		</Pressable>
		<FlatList
			data={searchResults}
			renderItem={renderItem}
			keyExtractor={item => item.id}
		/>
		</View>
	)}
	</View>
);
};

const styles = StyleSheet.create({
	container: {
	alignItems: 'center',
	width: '100%',
	},
	input: {
	height: 40,
	marginVertical: 12,
	borderWidth: 1,
	borderColor: '#ccc',
	padding: 10,
	width: '80%',
	backgroundColor: 'white',
	},
	button: {
	alignItems: 'center',
	justifyContent: 'center',
	paddingVertical: 12,
	paddingHorizontal: 32,
	borderRadius: 4,
	elevation: 3,
	backgroundColor: 'black',
	marginTop: 10,
	},
	buttonText: {
	color: 'white',
	fontSize: 16,
	},
	expandButton: {
	position: "relative",
	alignItems: "center",
	justifyContent: "center",
	paddingHorizontal: 16,
	height: 60,
	backgroundColor: "black",
	marginTop: 16,
	borderRadius: 4,
	width: 300,
	},
	expandButtonIcon: {
	position: "absolute",
	right: 16,
	},

	expandButtonText: {
	color: "white",
	fontWeight: "500",
	fontSize: 18,
	},
	userRow: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	paddingVertical: 10,
	paddingHorizontal: 20,
	width: '100%',
	},
	username: {
	flex: 1,
	marginLeft: 12,
	fontSize: 16,
	},
	addButton: {
	padding: 10,
	borderRadius: 4,
	marginLeft: 12,
	backgroundColor: 'black',
	},
	addButtonText: {
	color: 'white',
	fontSize: 14,
	},
	avatar: {
	width: 50,
	height: 50,
	borderRadius: 25,
	},
});

export default Friends;
