App from _Course 6_ 
> <em>How looks like app you can see</em> [GitHub](https://github.com/KseniiaMarkiv/capstone-api/tree/8-module)

# Capstone Demo Application
*I created analogy app but change design and improve AngularJS version and some gems*

---
### affected materials as
<ul>
  <li>Built skeleton app</li>
  <li>Frontend</li>
  <li>Backend</li>
</ul>

### I used version gems
<ul>
  <li>ruby - '3.1.1'</li>
  <li>rails - '7.0.1'</li>
</ul>

### Usage language
<ul>
  <li>Ruby</li>
  <li>HTML</li>
  <li>CSS</li>
  <li>JS</li>
</ul>

### Also implemented in app
<ul>
  <li>API usage</li>
  <li>CRUD operations</li>
  <li>DB usage</li>
    <ul>
      <li>DB - PostgreSQL</li>
      <li>storage DB - MongoDB</li>
      <li>ActiveRecord</li>
    </ul>
    <li>Frameworks: </li>
    <ul>
      <li>Rails</li>
      <li>AngularJS by rails-assets 1.5.9</li>
      <li>Bootstrap 5 (design)</li>
    </ul>
    <li>Google Maps by geokit-rails</li>
    <li>Deploing on Heroku</li>
    <li>Asset Pipeline Packaging</li>
    <li>review CORS by rack-cors</li>
    <li>RSpec test</li>
    <ul>
        <li>with ActiveRecord</li>
        <li>with MongoDB</li>
        <li>DatabaseCleaner Optimizations (DRYing method)</li>
        <li>FactoryBot and Fake Data</li>
        <li>Debugging Capybara, Selenium Tests</li>
     </ul>
     <li>Authentication through devise_token_auth</li>
     <ul>
        <li>Login</li>
        <li>Logout and Persisted Session</li>
        <li>Login Error Handling and Styling</li>
        <li>Server Role-based Authorization with Pundit Gem</li>
        <li>Relationships</li>
        <li>API: WhoAmI Service with User Roles</li>
     </ul>
     <li>Content Caching</li>
     <li>Content Validation</li>
</ul>

---


Origin of an app https://github.com/jhu-ep-coursera/capstone_demoapp 

# Capstone Repository Tags and Branches 
https://github.com/jhu-ep-coursera/fullstack-capstone-course/blob/master/repository_tags.md *(help more understanding what's suppose to happen in the app)*

####By the end of this assignment, you will be able to:

Implement a map view of elements related to selected item

Build on the skills from modules 5-7

Design and implement query access to a resource collection

Design and implement API access to a resource that contains information, geographic, and image properties

Design and implement a synchronized page of display components

Implement a list view of selectable of items

This assignment has a few options.

All assignment options are **intended to extend the course example** developed in the lectures. It is not intended that you start from scratch. By extending the course example covered in the lectures, you will not only have a decent starting point -- you will also have a base that is familiar to the peer grader to be able to more easily follow the details of your solution. You may augment or modify the course examples as needed.

All assignment options have **a minimal set of requirements** that could easily be far short of what a full capability would contain. You are to limit your implementations to only what is required to provide query/index of a resource collection, selection of a specific resource, and display related element information on a map. This is similar to the course example, but one key difference is that only a single item (group of elements) is displayed at a time on the map.

All assignment options **are notional**. You may use your imagination to fill in the details of the technical solution that will meet the overall goals of the assignment.

All mandatory capabilities of this assignment are read-only with no access restrictions required. All data made available to the will be ingested by you at deployment time by a db/seeds.rb or rakefile script. No user input should be required.

Detailed Assignment: https://drive.google.com/file/d/0BxOTj_EJTdDGcW9WMng2aW9WU00/view?usp=sharing

#### Review criteria
The assignment will be graded using interaction with the deployed application and inspection of source code in a public Git repository. The peer grader will answer a series of true/false questions that relate to the requirements of the assignment.

The only firm requirements of this assignment is that the solution must:

Implement a new page for the components of this assignment 

Implement (new or augment existing) a resource collection and ability to query that collection for items

Implement a selectable list of the resulting items

Display related elements to a single item on a map, using markers, when item is selected

Display information about the element when the marker is clicked

The solution and peer grading should focus on those key elements and allow the creative imagination of what the solution contains be constrained by only the student's imagination and time.
