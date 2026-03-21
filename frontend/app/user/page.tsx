"use client";
import axios from "axios";

import { useEffect, useState } from "react";

export default function UserPage() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await axios.get("http://localhost:8000/events/events/", {
					withCredentials: true
				});

				const data = await res.data;
				setEvents(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchEvents();
	}, []);

	return (
		<div className="p-10">
			<h1 className="text-xl mb-4">Your Events</h1>

			<ul>
				{events.map((event, index) => (
					<li key={index}>
						{event.name || JSON.stringify(event)}
					</li>
				))}
			</ul>
		</div>
	);
}