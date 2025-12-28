package com.campus360.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.telephony.SmsManager
import androidx.core.app.ActivityCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

@CapacitorPlugin(
    name = "SOSPlugin",
    permissions = [
        Permission(alias = "sos", strings = [
            Manifest.permission.CALL_PHONE,
            Manifest.permission.SEND_SMS,
            Manifest.permission.ACCESS_FINE_LOCATION
        ])
    ]
)
class SOSPlugin : Plugin() {

    @PluginMethod
    fun triggerSOS(call: PluginCall) {
        if (!hasSosPermissions()) {
            requestPermissionForAlias("sos", call, "sosPermsCallback")
            return
        }
        executeSOS(call)
    }

    @PluginMethod
    fun askForPermissions(call: PluginCall) {
        if (!hasSosPermissions()) {
             requestPermissionForAlias("sos", call, "permissionsCallback")
        } else {
            call.resolve()
        }
    }

    @PermissionCallback
    fun permissionsCallback(call: PluginCall) {
        if (hasSosPermissions()) {
            call.resolve()
        } else {
            call.reject("Permissions denied")
        }
    }

    @PermissionCallback
    fun sosPermsCallback(call: PluginCall) {
        if (hasSosPermissions()) {
            executeSOS(call)
        } else {
            call.reject("SOS permissions are required for this potentially life-saving feature.")
        }
    }

    private fun hasSosPermissions(): Boolean {
        return getPermissionState("sos") == com.getcapacitor.PermissionState.GRANTED
    }

    private fun executeSOS(call: PluginCall) {
        val phone = call.getString("phone") ?: "112"
        val messageBody = call.getString("message") ?: "HELP! I need emergency assistance."
        
        val contactsArray = call.getArray("contacts")
        val contacts = mutableListOf<String>()
        if (contactsArray != null) {
            for (i in 0 until contactsArray.length()) {
                contacts.add(contactsArray.getString(i))
            }
        }

        // 1. Get Location & Send SMS
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(activity)
        
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null)
                .addOnSuccessListener { location ->
                    var msg = messageBody
                    if (location != null) {
                        msg += "\n\nLocation: https://www.google.com/maps?q=${location.latitude},${location.longitude}"
                    } else {
                        msg += "\n\nLocation unavailable."
                    }
                    sendSMS(contacts, msg)
                }
                .addOnFailureListener {
                    sendSMS(contacts, "$messageBody\n\nLocation retrieve failed.")
                }
        } else {
             sendSMS(contacts, "$messageBody\n\nLocation permission missing.")
        }

        // 2. Make Direct Call
        makeDirectCall(phone)

        call.resolve()
    }

    @SuppressLint("MissingPermission") // Checked via Capacitor permissions
    private fun makeDirectCall(phoneNumber: String) {
        try {
            val intent = Intent(Intent.ACTION_CALL)
            intent.data = Uri.parse("tel:$phoneNumber")
            activity.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun sendSMS(contacts: List<String>, message: String) {
        try {
            val smsManager = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                context.getSystemService(SmsManager::class.java)
            } else {
                @Suppress("DEPRECATION")
                SmsManager.getDefault()
            }

            for (contact in contacts) {
                if (contact.isNotBlank()) {
                     // SMS sending is fire-and-forget here to be fast
                    val parts = smsManager.divideMessage(message)
                    smsManager.sendMultipartTextMessage(contact, null, parts, null, null)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
