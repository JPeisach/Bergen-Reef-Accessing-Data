# TODO, Wishlist, and more

Having gone through two capstone groups, and six people, there are lots of places that could use some work. Yes, the "products" are complete, but they aren't "perfect".

This was initially written by Joshua Peisach. Feel free to add/remove info as necessary.

# Frontend
## General
- Fully move out of Headless UI - use daisyUI
  - Both groups never really used it to its potential
  - Would you like examples for how Headless UI components work? Sorry, you have to pay for [Tailwind Plus](https://tailwindcss.com/plus). It's stupid.
  - daisyUI is free, this restores us to using raw HTML elements, but comes with lots of CSS. Speaking of...
- CSS/Styling cleanup
  - This is the big pitfall of Tailwind UI - you (or your LLM agent) just stacks random classNames, and eventually nobody knows what the purpose is of each style change being there.
  - We can do better. Try predefining CSS styles in files, and then import them. So instead of having lots of duplicate:
  ```html
  <div className="input flex border-base-100 px-5"/>
  ```

  We can have a CSS file like (this is psuedocode):
  ```css
  .customInputElement {
      display: flex;
      border: // (some border settings);
      padding-top: 5px;
  }
  ```

  And in the HTML/JSX
  ```html
  <div className="input customInputElement">
  ```

  DaisyUI helps resolve this mess with its predefined templates - try to use those before making new elements!
- Have a consistent charting library
  - There is both D3 and Recharts. The second group wanted to move entirely to Recharts but never got there. Most likely, the best choice is Recharts, but if there needs to be a change, make it a good choice with lots of maintenance, community around it, and documentation.
- Data visualizations
  - Sankey bump charts
  - Anything your heart desires - just make sure we can compare info from across tanks.
  - Make sure tooltips are consistent!
  - See if calculations can be moved into backend so the frontend has to do less work
- Observations
  - Can we tie an observation to an image of a tank, or a specific set of data? Maybe a specific graph?
- Cached settings
  - Make it so the prior setting enabled for a page (like date range) is not purged. Save it to localStorage.
- UI scaling
  - Make sure everything is appropriately visible on all screens, including TVs.
- Mobile friendliness
  - Make it good for small screens, like phones
- Search for TODOs and FIXMEs, and fix them.
- Add more to this section when you find more things to fix.
- Flatpickr/date selection theming
  - Self explanatory.
- Proper authentication checks
  - The UI won't let you edit/delete observations that aren't your own, but you may still be able to send the request and it might work anyway. Check this.
- Make history page show tank names - have better sorting

## React
<details>
<summary>First, an opinionated rant about React and web apps by Josh, if you care to read (optional):</summary>
**This is my own opinion and does not reflect the behavior of BRAD developers or anyone specifically.**

Ah, React. The industry's current stupid hype train. Because who cares about making a good performing app, when you can just cobble together a bunch of crap and have it work?

I think, that when you write code correctly, React is fine. But it shouldn't be used for things like the [WINDOWS 11 START MENU](https://www.windowslatest.com/2026/03/21/microsoft-confirms-windows-11-start-menu-performance-boost-shift-to-winui-from-web-based-components/). The idea of "everything should be a web app" is ridiculous. Spoiler alert: **There is more in the world than just web app development.**

JavaScript lets you get away with so much. TypeScript should help, in theory, but it kind of.. doesn't, in my opinion. It's hard to explain, I might make a blog post about this later.

It is insanely easy to use React at first, and do things that are correct, but have "bad execution". You can have components full of huge chunks of data just running all over the place - props updating in between components, rerenders and intervals happening *who knows when*, spaghetti code, and more. The few good uses for using LLMs in software development (if you even want to call web applications that aren't native "software", because I personally believe "software" is things that run on an operating system, and this does not), are web development projects, usually JS. Because it is so cognitively difficult for a person to know what the hell is going on. Besides, LLMs are so well trained on this because every industry pushes both web apps and LLM use, and with there being 100 ways to solve 1 solution in JS, who even knows what is good code anymore. As long as there is something able to work. Thanks industry!

If you want proof, I saw a video on Instagram of someone telling Claude to make Windows 12. And it made a **web application**. We live in such stupid times.

So, I think we all would've benefitted reading React documentation and good practices before we started. I'm guilty of this too. The issues in BRAD are not as horrible as what I am talking about (at least, I hope you don't find it that way), but they do exist.

Now that you have read my rant, next time someone tells you to make a web application, think, "Why do you need a web application? Why should I use software that has so much overhead and is a nightmare to develop for? Are you sure that you can't develop a NATIVE application so I can use the insane performance we have with our hardware, but is wasted by such technical debt? And am I just writing this using this stack because it's actually appropriate, or am I jumping on the bandwagon?" If you are given a proposal for a project that uses a web development stack when it is inappropriate, don't continue reading it once you realized such (unless there is justification). Print out a copy of it and burn it instead. It's a good symbolic gesture.

This really deserves in my own blog post, I'll hopefully get around to it sometime and I'll link it here. I'm spending my free period I should be studying for English, but this is important.
</details>

BRAD suffers from some technical debt, to say the least.

### Routing
- Is this supposed to be a single page application?
- See if there are ways we can cleanup the navigation

### Component Cleanup
- I like [this post](https://medium.com/@shankhwarshipra2001/how-i-cleaned-up-my-react-code-from-clunky-components-to-clean-architecture-1f67761a04fd) I found. We can probably apply a lot of it. Read it.
- Separate code fetching logic from rendering and elements
  - See the "services" folder.
- Try to have lots of small components instead of BIG components - make it make sense.
- State, props insanity
  - Not even I am good at this - React has documentation about good state management, and there are tools around for not having a million useless states and props jumping around components.
- Rerendering when needed
  - I also couldn't figure this out. Ensure that data is refreshed and reloaded when necessary. For example, if I select to view another type of tank, the other component showing the stats should update and instantly check for new data. I shouldn't need to have a timer that is short enough to make the wait time "not as bad".
- Cleanup/refactor the navigation bar/sidebar
  - I don't even know how it works, but I know that there is something weird about it.
  - It works, sure? But it's also floating?
  - DaisyUI's equivalent of a navigation menu (a "[drawer](https://daisyui.com/components/drawer/)") kind of has the pages run have its content inside the drawer-content block (I think). Basically, it will take time for every page to work with the new solution.
- There is both HistoricDataTankBox and RecentDataTankBox - maybe they should be merged together
  - Also, the HistoricDataTankBox's use on the individual tanks page shows old data, but really the "tank box" can be different kinds of graphs. So the tank box just being a line graph makes no sense.
- Date elements - work smarter, not harter
  - The first group may not have been aware of the fact that like.. you can go on NPM and find a premade React flatpickr component? Instead of making your own? (Of course, now we need to be careful of dependencies and supply chain attacks, but that is a think you can go.)
- Try to find an actually well written React web application, and note how it keeps the code clean.

### Auth0
- Make sure we are using latest versions of Auth0 services and integration
- Also make sure that we are keeping client stuff on client side, and server stuff on server side.

# Backend
## APIs
- Make sure we have appropriate API routes for the operation we need
  - A lot of the endpoints are similar to each other by name, and by operation
  - Shift some of the data organization and computation (like the filtering) to the API so it doesn't have to calculated on the browser frontend

## Database
- One of the topics that we (the second group) discussed was data in the database. It is stored where each sensor gets it's row. However, is there rationale to having each row be a single report, with each sensor value getting its own column?
  - There are tradeoffs to this. It requires definite hardcoded names for each variable - Tmpx3 and Tmpx4 both mean temperature, but need to be in "Temperature"
  - Some things to think about:
    - Is less data being stored this way? Is it easier for the DB to compress?
    - Which is best for linking observations to reports?
  - We chose to stick with the current model, after lots of consulting with our mentors. But it may not hurt to review it again.
- Store images of tanks
  - This made an argument for using a non-relational DB when it came to the above point, but you "can" store image data in relational databases, it's just.. silly (in my opinion, -Josh)

# Other
- Check dependencies, make sure everything is up to date
- Security audit
- Restore the Google Sheets backup system?
- Raspberry Pi script documentation (setting it up, cron or systemd timers, etc.)
- Folder reorganization
  - For example: What is the actions folder for?
- Can there be a native application of BRAD (e.g. a desktop or phone app)?
  - Flutter, for example, was made with this in mind. React was not, but maybe you can make something work with Electron.
