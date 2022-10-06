const { exec } = require('child_process')

if (process.env.MODE === 'WEB') {
  console.log(
    `❌ In ${process.env.MODE} mode there is no need to hack (install) shims for core node modules. All good!`
  )
  return
}

const commands = [
  // Installs shims for core node modules. It recurses down node_modules and
  // modifies all the package.json's in there to add/update the browser and
  // react-native fields. See {@link https://github.com/tradle/rn-nodeify}
  '$(npm bin)/rn-nodeify --install assert,zlib,buffer,inherits,console,constants,crypto,dns,domain,events,http,https,path,process,punycode,querystring,fs,stream,string_decoder,timers,tty,url,util,vm,tls --hack --yarn'
]

exec(commands.join(' && '), (error) => {
  if (error) {
    throw error
  }

  console.log('✅ Finishes installing shims for the core node modules. Sounds all right!')
})
