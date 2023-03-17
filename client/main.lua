local p = nil

local function MiniGame(button, lvl)
    if not button or button < 1 then button = 1 end
    if not lvl or lvl < 1 then lvl = 1 end
    p = promise.new()
    SendNUIMessage({
        action = 'start',
        button = button,
        lvl = lvl,
    })
    SetNuiFocus(true, true)
    local result = Citizen.Await(p)
    return result
end

RegisterNUICallback('fail', function(data, cb)
    p:resolve(false)
    p = nil
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('success', function(data, cb)
    p:resolve(true)
    p = nil
    SetNuiFocus(false, false)
    cb('ok')
end)

exports("MiniGame", MiniGame)

RegisterCommand('bunkerbox', function(source, args, rawCommand)
   local success = exports['kd_bunkerbox']:MiniGame(tonumber(args[1]), tonumber(args[2]))
   print(success)
end)