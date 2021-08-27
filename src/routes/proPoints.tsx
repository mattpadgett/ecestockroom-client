import PPEvents from "../views/proPoints/PPEvents";
import PPSwipe from "../views/proPoints/PPSwipe";

export const ppSwipeRoute = {
	name: "Pro Points Event Swipe",
	path: "/pp/swipe",
	exact: false,
	component: PPSwipe
}

export const ppEventsRoute = {
	name: "Pro Points Events",
	path: "/pp/events",
	exact: false,
	component: PPEvents
}

export const proPointsRoutes = [ppSwipeRoute, ppEventsRoute];