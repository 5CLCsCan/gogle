export default function HomePage() {
  return (
    <main className='flex flex-col px-24'>
      <h1 className='text-primary text-4xl text-center mb-10'>
        Welcome to Gogle!
      </h1>
      <section>
        <h3 className='text-left text-2xl font-medium'>Your trips</h3>
        <div className='grid grid-cols-3 gap-4'>
          <div className='border border-gray-400 px-4 py-8 rounded-lg shadow-md'>
            <h4 className='text-2xl'>Trip to Paris</h4>
            <p>Paris, France</p>
            <p>2023-01-01 - 2023-01-07</p>
          </div>
          <div className='border border-gray-400 px-4 py-8 rounded-lg shadow-md'>
            <h4 className='text-2xl'>Trip to Tokyo</h4>
            <p>Tokyo, Japan</p>
            <p>2023-02-01 - 2023-02-07</p>
          </div>
          <div className='border border-gray-400 px-4 py-8 rounded-lg shadow-md'>
            <h4 className='text-2xl'>Trip to New York</h4>
            <p>New York, USA</p>
            <p>2023-03-01 - 2023-03-07</p>
          </div>
        </div>
      </section>
    </main>
  )
}
