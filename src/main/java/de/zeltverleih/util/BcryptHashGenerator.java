package de.zeltverleih.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Einmalig ausführen, um AUTH_PASSWORD_HASH für die Produktion zu erzeugen:
 * mvn -q exec:java -Dexec.mainClass=de.zeltverleih.util.BcryptHashGenerator -Dexec.args="IhrPasswort"
 */
public class BcryptHashGenerator {

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: BcryptHashGenerator <passwort>");
            System.exit(1);
        }
        System.out.println(new BCryptPasswordEncoder().encode(args[0]));
    }
}
