import { NavBar, Services, Loader, Transactions, Footer, Welcome } from "./components"

const App = ()=> {
  
  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
       
        <NavBar />
        <Welcome />
      </div>
      <Services /> 
      <Transactions />
      <Footer />
    </div>
  )
}

export default App
